import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';

// List of unprotected routes as regular expressions
const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
  /^\/about$/, // Matches '/about'
  /^\/pricing$/, // Matches '/pricing'
  /^\/api\/auth\/callback$/ // Matches '/api/auth/callback'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createClient();

  // Check if the current path matches any of the unprotected routes
  if (unprotectedRoutes.some(route => route.test(pathname))) {
    return await updateSession(request);
  }

  // For all other routes, check authentication
  const response = await updateSession(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to signin page if user is not authenticated
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};