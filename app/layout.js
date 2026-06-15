import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Voodoo Visualizer',
  description: 'Cinematische Music-Visualizer — direkt im Browser gerendert.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <header className="nav">
            <Link href="/" className="brand">VOODOO<span>VISUALIZER</span></Link>
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
          <main className="main">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
