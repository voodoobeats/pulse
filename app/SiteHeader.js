'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

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
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
