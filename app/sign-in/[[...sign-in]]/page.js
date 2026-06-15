import { SignIn } from '@clerk/nextjs';

export const metadata = { title: 'Login — Pulse' };

const wrap = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '4px' };
const h1 = { fontSize: 'clamp(28px, 5vw, 44px)', margin: 0, letterSpacing: '-0.02em', textAlign: 'center' };
const sub = { color: 'var(--ink-dim)', margin: '0 0 24px', textAlign: 'center' };

export default function SignInPage() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Pulse</h1>
      <p style={sub}>Willkommen zurück.</p>
      <SignIn />
    </div>
  );
}
