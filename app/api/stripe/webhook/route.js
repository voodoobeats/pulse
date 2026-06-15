import { clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}


// Write the subscription state onto the Clerk user (public metadata).
async function syncPlan(userId, subscription, customerId) {
  if (!userId) return;
  const active = ['active', 'trialing'].includes(subscription.status);
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      plan: active ? 'premium' : 'free',
      stripeCustomerId: customerId || subscription.customer || null,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: subscription.current_period_end || null,
    },
  });
}

export async function POST(req) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook signature error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.clerkUserId;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await syncPlan(userId, sub, session.customer);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.clerkUserId;
        await syncPlan(userId, sub, sub.customer);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }

  return Response.json({ received: true });
}
