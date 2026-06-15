import { redirect } from 'next/navigation';

// /studio existiert weiter, leitet aber auf die Startseite (= Studio).
export default function StudioRedirect() {
  redirect('/');
}
