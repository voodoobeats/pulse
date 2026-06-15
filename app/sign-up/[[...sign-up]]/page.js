import { SignUp } from '@clerk/nextjs';

export const metadata = { title: 'Registrieren — Voodoo Visualizer' };

export default function SignUpPage() {
  return (
    <div className="auth-wrap">
      <SignUp />
    </div>
  );
}
