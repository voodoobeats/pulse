'use client';

import { useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';

// Renders the Clerk user button, with a small gold crown above the avatar
// for premium members. The premium flag is read live from Clerk and refreshed
// on mount and whenever the tab regains focus (e.g. returning from Stripe).
export default function AccountAvatar() {
  const { isSignedIn, user } = useUser();
  const isPremium = user?.publicMetadata?.plan === 'premium';

  useEffect(() => {
    if (!isSignedIn || !user) return;
    user.reload();
    const onFocus = () => user.reload();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isSignedIn, user?.id]);

  return (
    <span className={'acct-avatar' + (isPremium ? ' is-premium' : '')}>
      {isPremium && (
        <svg className="crown" viewBox="0 0 24 22" aria-hidden="true">
          <path d="M1 6l5 4 6-8 6 8 5-4-2.2 14H3.2L1 6z" />
        </svg>
      )}
      <UserButton afterSignOutUrl="/" />
    </span>
  );
}
