'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const MONTHLY = '9.99';
const YEARLY_PER_MONTH = '7.99';
const YEARLY_TOTAL = '95.90';

export default function PricingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [interval, setBilling] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const isPremium = user?.publicMetadata?.plan === 'premium';

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('success')) setBanner('success');
    else if (p.get('canceled')) setBanner('canceled');
  }, []);

  // Reflect the current Clerk status — avoids a stale "Manage subscription"
  // button or crown after subscribing, cancelling, or a failed payment.
  // Refresh on mount, on focus, and a few times after returning from Stripe
  // (the webhook updates the status asynchronously).
  useEffect(() => {
    if (!isSignedIn || !user) return;
    user.reload();
    const onFocus = () => user.reload();
    window.addEventListener('focus', onFocus);
    const timers = [];
    const p = new URLSearchParams(window.location.search);
    if (p.get('success')) {
      timers.push(setTimeout(() => user.reload(), 1500));
      timers.push(setTimeout(() => user.reload(), 4000));
      timers.push(setTimeout(() => user.reload(), 8000));
    }
    return () => {
      window.removeEventListener('focus', onFocus);
      timers.forEach(clearTimeout);
    };
  }, [isSignedIn, user?.id]);

  async function subscribe() {
    if (!isSignedIn) { window.location.href = '/sign-in'; return; }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setLoading(false); alert(data.error || 'Could not start checkout.'); }
    } catch {
      setLoading(false);
      alert('Something went wrong.');
    }
  }

  async function manage() {
    setLoading(true);
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      alert(data.error || 'Could not open the subscription portal.');
    } catch {
      alert('Connection to the subscription portal failed.');
    }
    setLoading(false);
  }

  const yearly = interval === 'yearly';

  return (
    <div className="page">
      <h1>Premium</h1>
      <p className="sub">Rendering, 4K export and Shorts — no limits.</p>

      {banner === 'success' && (
        <div className="banner ok">Welcome to Premium! Your access will be active shortly.</div>
      )}
      {banner === 'canceled' && (
        <div className="banner">Checkout canceled — you can try again anytime.</div>
      )}

      <div className="billing-toggle">
        <button className={!yearly ? 'active' : ''} onClick={() => setBilling('monthly')}>
          Monthly
        </button>
        <button className={yearly ? 'active' : ''} onClick={() => setBilling('yearly')}>
          Yearly <span className="save">-20%</span>
        </button>
      </div>

      <div className="tiers" style={{ maxWidth: '360px' }}>
        <div className="tier featured">
          <span className="badge">Premium</span>
          <h3>Pulse Premium</h3>

          <div className="price">
            &euro;{yearly ? YEARLY_PER_MONTH : MONTHLY} <small>/ month</small>
          </div>

          {yearly ? (
            <p className="price-note"><s>&euro;{MONTHLY}</s> &nbsp;&middot;&nbsp; &euro;{YEARLY_TOTAL} billed annually</p>
          ) : (
            <p className="price-note">Cancel anytime</p>
          )}

          <ul>
            <li>Unlimited rendering (1080p/60 &amp; 4K)</li>
            <li>Shorts export (vertical 9:16)</li>
            <li>No wait time</li>
            <li>Cancel anytime</li>
          </ul>

          {!isLoaded ? (
            <button className="btn" disabled>&hellip;</button>
          ) : isPremium ? (
            <>
              <div className="premium-active">&#10003; You&rsquo;re Premium</div>
              <button className="btn ghost" onClick={manage} disabled={loading}>Manage subscription</button>
            </>
          ) : (
            <button className="btn primary" onClick={subscribe} disabled={loading}>
              {loading ? 'Continuing to Stripe…' : 'Get Premium'}
            </button>
          )}
        </div>
      </div>

      <p className="pay-note">Secure payment via Stripe &middot; cancel anytime</p>
    </div>
  );
}
