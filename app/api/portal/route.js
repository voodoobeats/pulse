import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}


export async function POST(req) {
  const stripe = getStripe();
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user = await currentUser();
  const customerId = user?.publicMetadata?.stripeCustomerId;
  if (!customerId) return new Response('No Stripe customer', { status: 400 });

  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });

  return Response.json({ url: portal.url });
}
