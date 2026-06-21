import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  yearly: process.env.STRIPE_PRICE_YEARLY,
};

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Not signed in.' }, { status: 401 });

  const { interval } = await req.json().catch(() => ({}));
  const price = PRICES[interval] || PRICES.monthly;
  if (!price) {
    return Response.json({ error: 'No price configured (STRIPE_PRICE_* missing).' }, { status: 500 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const md = user?.publicMetadata || {};
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  // Trial-abuse guard: only first-time subscribers get the free trial. Anyone
  // who has ever subscribed or trialed before — even after cancelling — is
  // gated out, so cancel-and-resubscribe can't farm endless trials.
  // (stripeSubscriptionId is set by the webhook/sync after the first checkout,
  // so it stays set even once the subscription is cancelled.)
  const existingCustomerId = md.stripeCustomerId || null;
  const hasSubscribedBefore = !!md.hasUsedTrial || !!md.stripeSubscriptionId;

  try {
    const stripe = getStripe();
    const params = {
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      client_reference_id: userId,
      subscription_data: {
        metadata: { clerkUserId: userId },
        // 7-day free trial — code-controlled (NOT on the Stripe price) and only
        // granted to first-time subscribers.
        ...(hasSubscribedBefore ? {} : { trial_period_days: 7 }),
      },
      allow_promotion_codes: true,
      success_url: `${origin}/pricing?success=1&plan=${interval}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    };
    // Reuse the same Stripe customer per user so the trial/subscription history
    // is linked (Stripe rejects passing both customer and customer_email).
    if (existingCustomerId) params.customer = existingCustomerId;
    else params.customer_email = email;

    const session = await stripe.checkout.sessions.create(params);
    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Stripe checkout could not be created.' },
      { status: 500 }
    );
  }
}
