import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUserRole, getCompany } from './utils/supabase/queries';

// List of unprotected routes as regular expressions
export const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
  /^\/signup(\/.*)?$/,
  /^\/about$/, // Matches '/about'
  /^\/contact$/, // Matches '/contact'
  /^\/product(\/.*)?$|^$/, // Matches '/product', '/product/', and any subpath like '/product/feature'
  /^\/pricing$/, // Matches '/pricing'
  /^\/blog$/, // Matches '/pricing'
  /^\/help$/, // Matches '/pricing'
  /^\/team$/, // Matches '/pricing'

  /^\/api\/auth\/callback$/ // Matches '/api/auth/callback'
];

// Add the applicant route to the unprotected routes
const applicantRoutes = [
  /^\/assessment(\/.*)?$/,// Matches '/bot' and any subpath like '/bot/*'
  /^\/api(\/.*)?$/ // Matches '/api' and any subpath like '/api/*'
];

// Combine unprotected and applicant routes
const allUnprotectedRoutes = [...unprotectedRoutes, ...applicantRoutes];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createClient();

  // Check if the current path matches any of the unprotected or applicant routes
  if (allUnprotectedRoutes.some((route) => route.test(pathname))) {
    return await updateSession(request);
  }

  // For all other routes, check authentication
  const response = await updateSession(request);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to signin page if user is not authenticated
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Check user role
  // const { role } = user.user_metadata;
  const role = await getUserRole(supabase, user.id);
  // New: Check if the user is an applicant trying to access a recruiter route
  if (
    role === 'applicant' &&
    !applicantRoutes.some((route) => route.test(pathname))
  ) {
    const dashboardUrl = new URL('/dashboard', request.url);
    if (request.nextUrl.pathname !== dashboardUrl.pathname) {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  if (role === 'recruiter') {
    // Check if the recruiter has a company ID in the recruiters table
    const { data: recruitData, error } = await supabase
      .from('recruiters')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (error || !recruitData || !recruitData.company_id) {
      console.error('Error fetching recruiter data:', error);
      // If there's an error, no data, or no company_id, and trying to access a protected route,
      // redirect to the onboarding page
      if (
        !allUnprotectedRoutes.some((route) => route.test(pathname)) &&
        pathname !== '/settings/onboarding'
      ) {
        return NextResponse.redirect(
          new URL('/settings/onboarding', request.url)
        );
      }
    } else {
      // Check if company is configured
      const company = await getCompany(recruitData.company_id);
      if (!company?.Configured) {
        if (
          !allUnprotectedRoutes.some((route) => route.test(pathname)) &&
          pathname !== '/settings/onboarding'
        ) {
          return NextResponse.redirect(
            new URL('/settings/onboarding', request.url)
          );
        }
      }
    }
  }

  // Add a custom header for debugging
  response.headers.set('x-debug-request-path', request.nextUrl.pathname);
  response.headers.set('x-debug-message', 'Middleware executed');

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


