'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser, SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import AccountAvatar from './AccountAvatar';

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
      <div className="studio-account">
        <Link href="/pricing" className="acct-link">Pricing</Link>
        <SignedOut>
          <Link href="/sign-in" className="acct-link">Login</Link>
        </SignedOut>
        <SignedIn>
          <AccountAvatar />
        </SignedIn>
      </div>

      <iframe
        ref={iframeRef}
        src="/app/index.html"
        title="Pulse"
        className="studio-frame"
        allow="autoplay; clipboard-write; fullscreen"
      />

      {modal === 'login' && (
        <div className="modal-overlay" onClick={cancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">Sign in to render</p>
            <p className="modal-text">Editing and preview are free — rendering requires an account.</p>
            <SignIn routing="hash" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
            <button className="modal-close" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      {modal === 'premium' && (
        <div className="modal-overlay" onClick={cancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">Premium required</p>
            <p className="modal-text">Rendering and Shorts export are reserved for Premium members.</p>
            <Link href="/pricing" className="btn primary modal-cta">View Premium</Link>
            <button className="modal-close" onClick={cancel}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
