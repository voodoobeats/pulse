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
  const stripe = getStripe();
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { interval } = await req.json().catch(() => ({}));
  const price = PRICES[interval] || PRICES.monthly;
  if (!price) return new Response('Price not configured', { status: 500 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: userId,
    customer_email: email,
    subscription_data: { metadata: { clerkUserId: userId } },
    allow_promotion_codes: true,
    success_url: `${origin}/pricing?success=1`,
    cancel_url: `${origin}/pricing?canceled=1`,
  });

  return Response.json({ url: session.url });
}
