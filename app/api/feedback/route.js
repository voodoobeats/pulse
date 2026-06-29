import { auth, clerkClient } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

// User feedback / bug reports. Sending requires a signed-in Clerk user so we can
// identify who reported what (and credit a free month if a bug is reproducible).
// Each message is stored as one PRIVATE Vercel Blob at
// feedback/<userId>/<timestamp>.json holding { userId, email, message, ... }.
const ACCESS = 'private';
const MAX_LEN = 4000;
const SETUP_MSG = 'Feedback is not set up yet. Add a FEEDBACK_WEBHOOK_URL (Discord/Slack) and/or connect a Vercel Blob store, then redeploy.';

// Optional Discord/Slack incoming-webhook URL. When set, every message is also
// posted there so you get a notification instead of having to read the store.
const webhookUrl = () => process.env.FEEDBACK_WEBHOOK_URL || '';

// Post the feedback to a Discord or Slack incoming webhook. We send both the
// Discord (`content`) and Slack (`text`) field so the same URL works for either.
async function notifyWebhook(record) {
  const url = webhookUrl();
  if (!url) return false;
  const lines = [
    '🟢 **New Pulse feedback**',
    record.email ? `From: ${record.email}` : `From: user ${record.userId}`,
    record.page ? `Page: ${record.page}` : '',
    '',
    record.message,
  ].filter(Boolean).join('\n');
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: lines.slice(0, 1900), text: lines.slice(0, 1900) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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
  // Need at least one delivery channel configured.
  if (!blobReady() && !webhookUrl()) return Response.json({ error: SETUP_MSG }, { status: 503 });

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

  // Notify (Discord/Slack webhook) and store a backup copy in Blob. Succeed if
  // EITHER channel delivered, so a single misconfigured one doesn't lose feedback.
  let stored = false, notified = false;
  if (blobReady()) {
    try {
      await put(`feedback/${userId}/${Date.now()}.json`, JSON.stringify(record), {
        access: ACCESS, contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: true, token: blobToken(),
      });
      stored = true;
    } catch {}
  }
  notified = await notifyWebhook(record);

  if (stored || notified) return Response.json({ ok: true });
  return Response.json({ error: 'Could not send feedback. Please try again.' }, { status: 500 });
}
