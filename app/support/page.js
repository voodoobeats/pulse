'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';

export default function SupportPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [message, setMessage] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  async function send() {
    const text = message.trim();
    if (!text) { setError('Please enter a message.'); setState('error'); return; }
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, page: 'support', userAgent: navigator.userAgent }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setState('sent'); setMessage(''); }
      else { setError(data.error || 'Could not send. Please try again.'); setState('error'); }
    } catch {
      setError('Network error. Please try again.'); setState('error');
    }
  }

  return (
    <div className="legal support-page">
      <h1>Support</h1>
      <p className="updated">Feedback &amp; bug reports</p>

      <p>
        Found a bug or have an idea? We read every message.{' '}
        <strong>If we can reproduce a bug you report, we&rsquo;ll credit you a free month of Premium.</strong>
      </p>

      {!isLoaded ? (
        <p className="muted">Loading&hellip;</p>
      ) : !isSignedIn ? (
        <div className="support-signin">
          <p className="muted">Please sign in so we can identify your account and follow up on your report.</p>
          <SignInButton mode="redirect">
            <button className="btn primary">Sign in to send feedback</button>
          </SignInButton>
        </div>
      ) : state === 'sent' ? (
        <div className="support-sent">
          <p className="ok">Thanks — your message was sent. We appreciate it!</p>
          <button className="btn ghost" onClick={() => setState('idle')}>Send another</button>
        </div>
      ) : (
        <div className="support-form">
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); if (state === 'error') setState('idle'); }}
            placeholder="What happened, or what would you like to see? For bugs, steps to reproduce help a lot."
            rows={7}
            maxLength={4000}
          />
          {state === 'error' && <p className="err">{error}</p>}
          <button className="btn primary" onClick={send} disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
