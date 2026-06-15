import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
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
          <SignedIn>
            <header className="nav">
              <Link href="/studio" className="brand">VOODOO<span>VISUALIZER</span></Link>
              <nav className="nav-links">
                <Link href="/studio" className="nav-link">Studio</Link>
                <Link href="/pricing" className="nav-link">Preise</Link>
                <UserButton afterSignOutUrl="/" />
              </nav>
            </header>
          </SignedIn>
          <main className="main">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
