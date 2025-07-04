// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // Dashboard routes
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

// only run on “app routes” and API, not _next, images, favicon…
export const config = {
  matcher: [
    /*
      match all paths except:
      - _next/static    (Next.js assets)
      - _next/image     (Next.js Image optimization)
      - favicon.ico     (your favicon)
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
