import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Nicht angemeldet.' }, { status: 401 });

  const user = await currentUser();
  const customerId = user?.publicMetadata?.stripeCustomerId;
  if (!customerId) {
    return Response.json(
      { error: 'Kein Stripe-Kunde gefunden. Bitte schließe zuerst ein Abo ab.' },
      { status: 400 }
    );
  }

  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/pricing`,
    });
    return Response.json({ url: portal.url });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Stripe-Portal konnte nicht geöffnet werden.' },
      { status: 500 }
    );
  }
}
