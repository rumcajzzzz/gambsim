import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER_ID='user_2vfzGdD21bpu9Jr2PXkbJyKCWRs';

const isProtectedRoute = createRouteMatcher([
  '/api/:path*',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {

    const { userId } = await auth();
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: 'Forbidden: Only the admin can access this route.' },
        { status: 403 }
      );
    }
  }
});

export const config = {
  matcher: [
   '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
   '/(api|trpc)(.*)',
  ],
};
