import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import './globals.css';

export const metadata = {
  title: 'Pulse',
  description: 'Music visualizer — rendered right in your browser.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SiteHeader />
          <main className="main">{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
