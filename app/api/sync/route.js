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
  const custId = md.stripeCustomerId;

  // Nothing on record → nothing to verify; trust stored value (free).
  if (!subId && !custId) return Response.json({ plan: md.plan || 'free' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Wipe the stored billing state. Used when the customer/subscription no longer
  // exists in Stripe (e.g. a Stripe wipe during testing): their history is
  // genuinely gone, so we clear the dead ids (fixes "No such customer" at
  // checkout) and restore trial eligibility for a clean start. Normal users
  // can't delete their own Stripe records, so this isn't an abuse vector.
  async function resetBillingState() {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...md,
          plan: 'free',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          hasUsedTrial: false,
        },
      });
    } catch (_) {}
    return Response.json({ plan: 'free', reset: true });
  }

  const isMissing = (e) => e?.code === 'resource_missing' || e?.statusCode === 404;

  try {
    // 1) If a customer is on record, make sure it still exists. A deleted
    //    customer means the whole billing history is gone → reset.
    if (custId) {
      try {
        const c = await stripe.customers.retrieve(custId);
        if (c?.deleted) return await resetBillingState();
      } catch (e) {
        if (isMissing(e)) return await resetBillingState();
        // transient error → fall through and trust stored value below
      }
    }

    // 2) No subscription to verify → keep the stored plan.
    if (!subId) return Response.json({ plan: md.plan || 'free' });

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
    if (isMissing(err)) return await resetBillingState();
    // On a transient Stripe error, keep the stored value rather than locking out.
    return Response.json({ plan: md.plan || 'free', error: err?.message }, { status: 200 });
  }
}
