'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser, SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function StudioClient() {
  const iframeRef = useRef(null);
  const pendingKind = useRef(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [modal, setModal] = useState(null); // 'login' | 'premium' | null

  const isPremium = !!user && user.publicMetadata?.plan === 'premium';

  function approve() {
    const kind = pendingKind.current || 'main';
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'render-approved', kind },
      '*'
    );
    pendingKind.current = null;
    setModal(null);
  }

  function cancel() {
    pendingKind.current = null;
    setModal(null);
  }

  // The visualizer asks before every render — decide based on login + premium.
  useEffect(() => {
    function onMsg(e) {
      const d = e.data || {};
      if (d.type !== 'render-request') return;
      pendingKind.current = d.kind || 'main';
      if (!isSignedIn) setModal('login');
      else if (!isPremium) setModal('premium');
      else approve();
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [isSignedIn, isPremium]);

  // Continue a pending render once the user has signed in.
  useEffect(() => {
    if (!pendingKind.current || !isSignedIn) return;
    if (isPremium) approve();
    else setModal('premium');
  }, [isSignedIn, isPremium]);

  return (
    <>
      <iframe
        ref={iframeRef}
        src="/app/index.html"
        title="Voodoo Visualizer"
        className="studio-frame"
        allow="autoplay; clipboard-write; fullscreen"
      />

      {modal === 'login' && (
        <div className="modal-overlay" onClick={cancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">Zum Rendern anmelden</p>
            <p className="modal-text">Einstellen und Vorschau sind frei — fürs Rendern brauchst du einen Account.</p>
            <SignIn routing="hash" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
            <button className="modal-close" onClick={cancel}>Abbrechen</button>
          </div>
        </div>
      )}

      {modal === 'premium' && (
        <div className="modal-overlay" onClick={cancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">Premium benötigt</p>
            <p className="modal-text">Rendern und Shorts-Export sind Premium-Mitgliedern vorbehalten.</p>
            <Link href="/pricing" className="btn primary modal-cta">Premium ansehen</Link>
            <button className="modal-close" onClick={cancel}>Schließen</button>
          </div>
        </div>
      )}
    </>
  );
}
