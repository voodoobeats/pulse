import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only the visualizer itself requires login for now.
const isProtectedRoute = createRouteMatcher(['/studio(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except Next internals and files with an extension
    // (so the static visualizer at /app/index.html is served directly).
    '/((?!_next|[^?]*\\.[a-zA-Z0-9]+$).*)',
    '/(api|trpc)(.*)',
  ],
};
