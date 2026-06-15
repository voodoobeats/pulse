import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Independent reconciliation: verify the real subscription status against Stripe
// and write it back to Clerk. This makes the webhook an optimization rather than
// a single point of failure — even a missed cancel/expiry event self-heals the
// next time the user opens the app.
export async function POST() {
  const { userId } = auth();
  if (!userId) return Response.json({ plan: 'free' });

  const user = await currentUser();
  const md = user?.publicMetadata || {};
  const subId = md.stripeSubscriptionId;

  // No subscription on record → nothing to verify; trust stored value (free).
  if (!subId) return Response.json({ plan: md.plan || 'free' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sub = await stripe.subscriptions.retrieve(subId);
    const active = ['active', 'trialing'].includes(sub.status);
    const plan = active ? 'premium' : 'free';

    const periodEnd = sub.current_period_end || null;
    const cancelAtPeriodEnd = !!sub.cancel_at_period_end;
    if (
      plan !== md.plan ||
      periodEnd !== md.currentPeriodEnd ||
      cancelAtPeriodEnd !== !!md.cancelAtPeriodEnd
    ) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...md,
          plan,
          stripeCustomerId: md.stripeCustomerId || sub.customer || null,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd,
        },
      });
    }
    return Response.json({ plan });
  } catch (err) {
    // On a transient Stripe error, keep the stored value rather than locking out.
    return Response.json({ plan: md.plan || 'free', error: err?.message }, { status: 200 });
  }
}
