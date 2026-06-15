import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from './SiteHeader';
import './globals.css';

export const metadata = {
  title: 'Pulse',
  description: 'Music-Visualizer — direkt im Browser gerendert.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <SiteHeader />
          <main className="main">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
