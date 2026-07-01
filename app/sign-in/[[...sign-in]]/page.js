import { SignIn } from '@clerk/nextjs';
import PricingBg from '../../pricing/PricingBg';

export const metadata = { title: 'Sign in — Pulse' };

const wrap = { position: 'relative', zIndex: 1, minHeight: 'calc(100vh - var(--nav-h) - var(--footer-h))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '4px' };
const h1 = { fontSize: 'clamp(28px, 5vw, 44px)', margin: 0, letterSpacing: '-0.02em', textAlign: 'center' };
const sub = { color: 'var(--ink-dim)', margin: '0 0 24px', textAlign: 'center' };

export default function SignInPage() {
  return (
    <>
      <PricingBg />
      <div style={wrap}>
        <h1 style={h1}>Pulse</h1>
        <p style={sub}>Welcome back.</p>
        <SignIn />
      </div>
    </>
  );
}
