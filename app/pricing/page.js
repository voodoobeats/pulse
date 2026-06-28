'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { fbTrack } from '../fbpixel';
import PricingBg from './PricingBg';

const MONTHLY = '9.99';
const YEARLY_PER_MONTH = '8.33';
const YEARLY_TOTAL = '99.99';
const TRIAL_DAYS = 7;

export default function PricingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [interval, setBilling] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const md = user?.publicMetadata || {};
  const isPremium = md.plan === 'premium';
  // Trial is only offered to first-time subscribers (mirrors the checkout guard).
  const hasSubscribedBefore = !!md.hasUsedTrial || !!md.stripeSubscriptionId;
  const showTrial = !isPremium && !hasSubscribedBefore;
  const cancelAtPeriodEnd = !!md.cancelAtPeriodEnd;
  const endsOn = md.currentPeriodEnd
    ? new Date(md.currentPeriodEnd * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('success')) {
      setBanner('success');
      // Meta Pixel Purchase — once per checkout session
      const sid = p.get('session_id');
      const plan = p.get('plan');
      const key = 'fb_purchase_' + (sid || 'session');
      if (!localStorage.getItem(key)) {
        const value = plan === 'yearly' ? parseFloat(YEARLY_TOTAL) : parseFloat(MONTHLY);
        fbTrack('Purchase', { value, currency: 'USD' });
        if (sid) localStorage.setItem(key, '1');
      }
    } else if (p.get('canceled')) {
      setBanner('canceled');
    }
  }, []);

  // Reflect the current Clerk status — avoids a stale "Manage subscription"
  // button or crown after subscribing, cancelling, or a failed payment.
  // Refresh on mount, on focus, and a few times after returning from Stripe
  // (the webhook updates the status asynchronously).
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const sync = () => fetch('/api/sync', { method: 'POST' }).catch(() => {}).finally(() => user.reload());
    sync();
    const onFocus = () => sync();
    window.addEventListener('focus', onFocus);
    const timers = [];
    const p = new URLSearchParams(window.location.search);
    if (p.get('success')) {
      timers.push(setTimeout(sync, 1500));
      timers.push(setTimeout(sync, 4000));
      timers.push(setTimeout(sync, 8000));
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
    <>
      <PricingBg />
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
          Yearly <span className="save">-17%</span>
        </button>
      </div>

      <div className="tiers" style={{ maxWidth: '360px' }}>
        <div className="tier featured">
          <span className="badge">Premium</span>
          <h3>Pulse Premium</h3>

          <div className="price">
            ${yearly ? YEARLY_PER_MONTH : MONTHLY} <small>/ month</small>
          </div>

          {yearly ? (
            <p className="price-note"><s>${MONTHLY}</s> &nbsp;&middot;&nbsp; ${YEARLY_TOTAL} billed annually</p>
          ) : (
            <p className="price-note">Cancel anytime</p>
          )}

          {showTrial && (
            <p className="price-note">{TRIAL_DAYS}-day free trial &middot; then ${yearly ? `${YEARLY_TOTAL}/year` : `${MONTHLY}/month`}</p>
          )}

          <ul>
            {showTrial && (
              <li>{TRIAL_DAYS}-day free trial &mdash; cancel before it ends, pay nothing</li>
            )}
            <li>Lightning-fast rendering &mdash; full tracks export in moments</li>
            <li>Auto-generate Shorts &amp; Reels in a click</li>
            <li>Endlessly customizable &mdash; every effect in your control</li>
            <li>Runs right in your browser &mdash; no other software needed</li>
          </ul>

          {!isLoaded ? (
            <button className="btn" disabled>&hellip;</button>
          ) : isPremium ? (
            <>
              <div className="premium-active">&#10003; You&rsquo;re Premium</div>
              <button className="btn ghost" onClick={manage} disabled={loading}>Manage subscription</button>
              {cancelAtPeriodEnd && endsOn && (
                <p className="cancel-note">Your premium status ends on {endsOn}</p>
              )}
            </>
          ) : (
            <button className="btn primary" onClick={subscribe} disabled={loading}>
              {loading ? 'Continuing to Stripe…' : (showTrial ? `Start ${TRIAL_DAYS}-day free trial` : 'Get Premium')}
            </button>
          )}
        </div>
      </div>

      <p className="pay-note">Secure payment via Stripe &middot; cancel anytime</p>
    </div>
    </>
  );
}
