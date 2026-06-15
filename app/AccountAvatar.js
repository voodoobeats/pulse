'use client';

import { useUser, UserButton } from '@clerk/nextjs';

// Renders the Clerk user button, with a small gold crown above the avatar
// for premium members.
export default function AccountAvatar() {
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.plan === 'premium';

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
