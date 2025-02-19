import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getUserRole, getCompany } from '@/utils/supabase/queries';
import { createClient } from './server';

// List of unprotected routes as regular expressions
export const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
  /^\/signin\/password_signin(\/.*)?$/, // Matches '/signin/password_signin' with query params
  /^\/password_signin(\/.*)?$/,
  /^\/signup(\/.*)?$/,
  /^\/about$/, // Matches '/about'
  /^\/contact$/, // Matches '/contact'
  /^\/product(\/.*)?$|^$/, // Matches '/product', '/product/', and any subpath like '/product/feature'
  /^\/pricing$/, // Matches '/pricing'
  /^\/blog$/, // Matches '/blog'
  /^\/help$/, // Matches '/help'
  /^\/team$/, // Matches '/team'
  /^\/api\/auth\/callback$/ // Matches '/api/auth/callback'
];

// Add the applicant route to the unprotected routes
const applicantRoutes = [
  /^\/assessment(\/.*)?$/,// Matches '/bot' and any subpath like '/bot/*'
  /^\/api(\/.*)?$/ // Matches '/api' and any subpath like '/api/*'
];

const staticRoutes = [
  /^\/Videos(\/.*)?$/, // Matches '/Videos' and any subpath
  /^\/images(\/.*)?$/,
  /^\/assets(\/.*)?$/,
  /\.(ico|png|jpg|jpeg|gif|svg|mp4|webm)$/, // Matches common static file extensions
];

// Combine unprotected and applicant routes
export const allUnprotectedRoutes = [
  ...unprotectedRoutes, 
  ...applicantRoutes,
  ...staticRoutes
];

export async function handleAuthRedirects(request: NextRequest, user: any) {
  const { pathname } = request.nextUrl;
  
  // Redirect authenticated users away from signin/signup routes to /dashboard
  if (/^\/(signin|signup)(\/.*)?$/.test(pathname)) {
    if (user) {
      console.log('[Middleware] Redirecting user to dashboard:', user);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return null;
  }

  // For protected routes, if no user is found, redirect to signin
  if (!allUnprotectedRoutes.some((route) => route.test(pathname)) && !user) {
    console.log('[Middleware] Redirecting user to signin:', user);
    return NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_SITE_URL || request.url));
  }

  return null;
}

export async function handleRecruiterRedirects(request: NextRequest, supabase: any, user: any) {
  const { pathname } = request.nextUrl;
  const role = await getUserRole(supabase, user.id);
  const isOnboardingPage = pathname === '/settings/onboarding';

  if (role === 'recruiter') {
    const { data: recruitData, error } = await supabase
      .from('recruiters')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if ((error || !recruitData || !recruitData.company_id) && !isOnboardingPage) {
      return NextResponse.redirect(new URL('/settings/onboarding', request.url));
    } else if (recruitData?.company_id && !isOnboardingPage) {
      const company = await getCompany(recruitData.company_id);
      if (!company?.Configured) {
        return NextResponse.redirect(new URL('/settings/onboarding', request.url));
      }
    }
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  console.log('[Middleware] Updating session...');
  // console.log('[Middleware] Initial request cookies:', request.cookies.getAll());
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createClient();
  // console.log('[Middleware] Created client:', supabase);

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('[Middleware] Got user:', user ? 'Present' : 'None');
  console.log('[Middleware] Final response cookies:', supabaseResponse.cookies.getAll());

  // Handle auth redirects
  const authRedirect = await handleAuthRedirects(request, user);
  if (authRedirect) {
    return authRedirect;
  }

  // Handle recruiter-specific redirects if user is authenticated
  if (user) {
    const recruiterRedirect = await handleRecruiterRedirects(request, supabase, user);
    if (recruiterRedirect) return recruiterRedirect;
  }
  // Add debug headers
  supabaseResponse.headers.set('x-debug-request-path', request.nextUrl.pathname);
  supabaseResponse.headers.set('x-debug-message', 'Middleware executed');

  console.log("here");
  return supabaseResponse;
}
