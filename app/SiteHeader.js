'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import AccountAvatar from './AccountAvatar';

// Slim header for sub-pages. The studio (/) has no top bar — it uses its own
// floating account control so the visualizer gets the full height.
export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <header className="nav">
      <Link href="/" className="brand">PULSE</Link>
      <nav className="nav-links">
        <Link href="/pricing" className="nav-link">Preise</Link>
        <SignedOut>
          <Link href="/sign-in" className="btn ghost">Login</Link>
        </SignedOut>
        <SignedIn>
          <AccountAvatar />
        </SignedIn>
      </nav>
    </header>
  );
}
