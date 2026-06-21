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
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      client_reference_id: userId,
      customer_email: email,
      subscription_data: {
        // 7-day free trial on every new subscription (monthly & yearly).
        // The trial lives here in code — NOT on the Stripe price — so it can
        // be changed anytime without recreating prices.
        trial_period_days: 7,
        metadata: { clerkUserId: userId },
      },
      allow_promotion_codes: true,
      success_url: `${origin}/pricing?success=1&plan=${interval}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    });
    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Stripe checkout could not be created.' },
      { status: 500 }
    );
  }
}
