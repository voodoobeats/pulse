'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const MONTHLY = '9,99';
const YEARLY_PER_MONTH = '7,99';
const YEARLY_TOTAL = '95,90';

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
      else { setLoading(false); alert('Checkout konnte nicht gestartet werden.'); }
    } catch {
      setLoading(false);
      alert('Etwas ist schiefgelaufen.');
    }
  }

  async function manage() {
    setLoading(true);
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      alert(data.error || 'Das Abo-Portal konnte nicht geöffnet werden.');
    } catch {
      alert('Verbindung zum Abo-Portal fehlgeschlagen.');
    }
    setLoading(false);
  }

  const yearly = interval === 'yearly';

  return (
    <div className="page">
      <h1>Premium</h1>
      <p className="sub">Rendern, 4K-Export und Shorts — ohne Limit.</p>

      {banner === 'success' && (
        <div className="banner ok">Willkommen bei Premium! Dein Zugang ist gleich aktiv.</div>
      )}
      {banner === 'canceled' && (
        <div className="banner">Checkout abgebrochen — du kannst es jederzeit erneut versuchen.</div>
      )}

      <div className="billing-toggle">
        <button className={!yearly ? 'active' : ''} onClick={() => setBilling('monthly')}>
          Monatlich
        </button>
        <button className={yearly ? 'active' : ''} onClick={() => setBilling('yearly')}>
          Jährlich <span className="save">-20%</span>
        </button>
      </div>

      <div className="tiers" style={{ maxWidth: '360px' }}>
        <div className="tier featured">
          <span className="badge">Premium</span>
          <h3>Pulse Premium</h3>

          <div className="price">
            {yearly ? YEARLY_PER_MONTH : MONTHLY} € <small>/ Monat</small>
          </div>

          {yearly ? (
            <p className="price-note"><s>{MONTHLY} €</s> &nbsp;&middot;&nbsp; {YEARLY_TOTAL} &euro; jährlich abgerechnet</p>
          ) : (
            <p className="price-note">Monatlich kündbar</p>
          )}

          <ul>
            <li>Unbegrenztes Rendern (1080p/60 &amp; 4K)</li>
            <li>Shorts-Export (vertikal 9:16)</li>
            <li>Keine Wartezeit</li>
            <li>Jederzeit kündbar</li>
          </ul>

          {!isLoaded ? (
            <button className="btn" disabled>&hellip;</button>
          ) : isPremium ? (
            <>
              <div className="premium-active">&#10003; Du bist Premium</div>
              <button className="btn ghost" onClick={manage} disabled={loading}>Abo verwalten</button>
            </>
          ) : (
            <button className="btn primary" onClick={subscribe} disabled={loading}>
              {loading ? 'Weiter zu Stripe…' : 'Premium holen'}
            </button>
          )}
        </div>
      </div>

      <p className="pay-note">Sichere Zahlung über Stripe &middot; jederzeit kündbar</p>
    </div>
  );
}
