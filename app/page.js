import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Einstieg: eingeloggt -> Studio, sonst -> Registrieren.
export default function Home() {
  const { userId } = auth();
  redirect(userId ? '/studio' : '/sign-up');
}
