import { ClerkProvider } from '@clerk/nextjs';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MetaPixel from './MetaPixel';
import './globals.css';

export const metadata = {
  title: 'Pulse',
  description: 'Music visualizer — rendered right in your browser.',
};

// Pulse-styled Clerk components (sign-in / sign-up / user button).
const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const clerkAppearance = {
  variables: {
    colorPrimary: '#5f6ee7',
    colorBackground: '#1b1926',
    colorText: '#e9eef6',
    colorTextSecondary: '#8f93b8',
    colorInputBackground: '#242233',
    colorInputText: '#e9eef6',
    colorDanger: '#ff5dcc',
    colorSuccess: '#5dc190',
    colorNeutral: '#e9eef6',
    borderRadius: '10px',
    fontFamily: SANS,
  },
  elements: {
    card: { backgroundColor: '#1b1926', border: '1px solid #463c5e', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    headerTitle: { color: '#e9eef6', fontWeight: 700, letterSpacing: '-0.01em' },
    headerSubtitle: { color: '#8f93b8' },
    socialButtonsBlockButton: { backgroundColor: '#242233', border: '1px solid #463c5e', color: '#e9eef6' },
    socialButtonsBlockButton__hover: { backgroundColor: '#2b2940' },
    dividerLine: { backgroundColor: '#322f48' },
    dividerText: { color: '#5c5e7e' },
    formFieldLabel: { color: '#8f93b8' },
    formFieldInput: { backgroundColor: '#242233', border: '1px solid #463c5e', color: '#e9eef6' },
    formButtonPrimary: {
      background: 'linear-gradient(90deg, #5f6ee7, #5fc9e7)',
      color: '#0b0a12', fontWeight: 700, textTransform: 'none', boxShadow: 'none',
    },
    footerActionLink: { color: '#5efdf7' },
    identityPreviewText: { color: '#e9eef6' },
    formResendCodeLink: { color: '#5efdf7' },
    footer: { background: 'transparent' },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body>
          <MetaPixel />
          <SiteHeader />
          <main className="main">{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
