import { auth } from '@clerk/nextjs/server';
import { put, list, del, get } from '@vercel/blob';

export const runtime = 'nodejs';

// Named presets (settings + logo image) are stored per-user in PRIVATE Vercel
// Blob storage: files are only reachable through this authenticated API, never
// via a public URL. Each preset is one JSON blob at presets/<userId>/<name>.json
// holding { preset, logo }. Requires BLOB_READ_WRITE_TOKEN (added automatically
// when you connect a Blob store to the Vercel project).
const ACCESS = 'private';
const MAX_NAME = 60;
const SETUP_MSG = 'Preset storage is not set up yet. Connect a (Private) Vercel Blob store to this project and redeploy.';

// Resolve a Blob read-write token if one exists (its value always starts with
// "vercel_blob_rw_", whatever the env var is named). Returns undefined if there
// is none — in that case the SDK falls back to OIDC auth automatically, using
// VERCEL_OIDC_TOKEN (injected at runtime) + BLOB_STORE_ID.
function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const v of Object.values(process.env)) {
    if (typeof v === 'string' && v.startsWith('vercel_blob_rw_')) return v;
  }
  return undefined;
}
// Storage is usable if we have either a read-write token OR the OIDC store id
// (the @vercel/blob SDK then authenticates via the runtime VERCEL_OIDC_TOKEN).
const blobReady = () => !!(blobToken() || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);
const PREFIX = (userId) => `presets/${userId}/`;
const pathFor = (userId, name) => `${PREFIX(userId)}${encodeURIComponent(name)}.json`;
const nameFromPath = (pathname) => {
  try { return decodeURIComponent(pathname.split('/').pop().replace(/\.json$/, '')); }
  catch { return pathname.split('/').pop().replace(/\.json$/, ''); }
};

// GET            → list of the user's presets (names only, no payload)
// GET ?name=X    → the full { preset, logo } payload for one preset
export async function GET(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ presets: [], signedIn: false });
  if (!blobReady()) return Response.json({ presets: [], signedIn: true, setup: SETUP_MSG });

  const token = blobToken();
  const name = new URL(req.url).searchParams.get('name');
  try {
    if (name) {
      const res = await get(pathFor(userId, name), { access: ACCESS, token });
      if (!res || !res.stream) return Response.json({ error: 'Preset not found.' }, { status: 404 });
      const text = await new Response(res.stream).text();
      return new Response(text, { headers: { 'content-type': 'application/json' } });
    }
    const { blobs } = await list({ prefix: PREFIX(userId), token });
    const presets = blobs
      .map((b) => ({ name: nameFromPath(b.pathname), size: b.size, uploadedAt: b.uploadedAt }))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return Response.json({ presets, signedIn: true });
  } catch (err) {
    return Response.json({ presets: [], signedIn: true, error: err?.message }, { status: 200 });
  }
}

// POST { name, data } → save/overwrite. `data` is the JSON string { preset, logo }.
export async function POST(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Sign in to save presets.' }, { status: 401 });
  if (!blobReady()) return Response.json({ error: SETUP_MSG }, { status: 503 });

  const { name, data } = await req.json().catch(() => ({}));
  const cleanName = String(name || '').trim().slice(0, MAX_NAME);
  if (!cleanName) return Response.json({ error: 'A preset name is required.' }, { status: 400 });
  if (typeof data !== 'string' || !data) return Response.json({ error: 'Invalid preset data.' }, { status: 400 });

  const token = blobToken();
  try {
    await put(pathFor(userId, cleanName), data, {
      access: ACCESS,
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });
    const { blobs } = await list({ prefix: PREFIX(userId), token });
    return Response.json({ ok: true, names: blobs.map((b) => nameFromPath(b.pathname)) });
  } catch (err) {
    return Response.json({ error: err?.message || 'Could not save preset.' }, { status: 500 });
  }
}

// DELETE ?name=X → remove a preset.
export async function DELETE(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Sign in to manage presets.' }, { status: 401 });
  const name = new URL(req.url).searchParams.get('name');
  if (!name) return Response.json({ error: 'Missing preset name.' }, { status: 400 });
  const token = blobToken();
  try {
    await del(pathFor(userId, name), { token });
    const { blobs } = await list({ prefix: PREFIX(userId), token });
    return Response.json({ ok: true, names: blobs.map((b) => nameFromPath(b.pathname)) });
  } catch (err) {
    return Response.json({ error: err?.message || 'Could not delete preset.' }, { status: 500 });
  }
}
