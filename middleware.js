import { clerkMiddleware } from '@clerk/nextjs/server';

// Minimal: stellt Clerks Auth-Kontext fürs SSR bereit. Noch kein Routenschutz —
// /studio bleibt vorerst offen (bauen wir später ein).
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[a-zA-Z0-9]+$).*)',
    '/(api|trpc)(.*)',
  ],
};
