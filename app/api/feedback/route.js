import { auth, clerkClient } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

// User feedback / bug reports. Sending requires a signed-in Clerk user so we can
// identify who reported what (and credit a free month if a bug is reproducible).
// Each message is stored as one PRIVATE Vercel Blob at
// feedback/<userId>/<timestamp>.json holding { userId, email, message, ... }.
const ACCESS = 'private';
const MAX_LEN = 4000;
const SETUP_MSG = 'Feedback storage is not set up yet. Connect a (Private) Vercel Blob store to this project and redeploy.';

// Same token resolution as the presets route: explicit RW token if present,
// otherwise let the SDK fall back to OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN).
function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const v of Object.values(process.env)) {
    if (typeof v === 'string' && v.startsWith('vercel_blob_rw_')) return v;
  }
  return undefined;
}
const blobReady = () => !!(blobToken() || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN);

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Please sign in to send feedback.' }, { status: 401 });
  if (!blobReady()) return Response.json({ error: SETUP_MSG }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const message = String(body.message || '').trim().slice(0, MAX_LEN);
  if (!message) return Response.json({ error: 'Please enter a message.' }, { status: 400 });

  // Best-effort: attach the user's primary email so we can reply / credit them.
  let email = '';
  try {
    const user = await clerkClient.users.getUser(userId);
    email = user?.primaryEmailAddress?.emailAddress
      || user?.emailAddresses?.[0]?.emailAddress || '';
  } catch {}

  const record = {
    userId,
    email,
    message,
    page: String(body.page || ''),
    userAgent: String(body.userAgent || req.headers.get('user-agent') || ''),
    createdAt: new Date().toISOString(),
  };

  try {
    const path = `feedback/${userId}/${Date.now()}.json`;
    await put(path, JSON.stringify(record), {
      access: ACCESS,
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: blobToken(),
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err?.message || 'Could not send feedback.' }, { status: 500 });
  }
}
