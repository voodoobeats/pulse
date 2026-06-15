import { clerkMiddleware } from '@clerk/nextjs/server';

// Stellt nur Clerks Auth-Kontext bereit. Keine Route ist gesperrt — alles ist
// offen; gerendert werden darf nur mit Login + Premium (im Studio geprüft).
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[a-zA-Z0-9]+$).*)',
    '/(api|trpc)(.*)',
  ],
};
