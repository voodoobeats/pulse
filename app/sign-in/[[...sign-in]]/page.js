import { SignIn } from '@clerk/nextjs';

export const metadata = { title: 'Login — Voodoo Visualizer' };

export default function SignInPage() {
  return (
    <div className="auth-wrap">
      <SignIn />
    </div>
  );
}
