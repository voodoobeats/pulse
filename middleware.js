import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Login-Pflicht für Studio und Pricing. Nicht eingeloggte Nutzer werden
// automatisch auf /sign-in geschickt.
const isProtectedRoute = createRouteMatcher(['/studio(.*)', '/pricing(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[a-zA-Z0-9]+$).*)',
    '/(api|trpc)(.*)',
  ],
};
