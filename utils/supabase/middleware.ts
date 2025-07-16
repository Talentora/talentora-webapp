'use server'

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getUserRole, getCompany } from '@/utils/supabase/queries';

// Create middleware-specific Supabase client
const createMiddlewareClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for middleware
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response };
};

// List of unprotected routes as regular expressions
export const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
  /^\/signin\/password_signin(\/.*)?$/, // Matches '/signin/password_signin' with query params
  /^\/password_signin(\/.*)?$/,
  /^\/demo(\/.*)?$/,
  /^\/signup(\/.*)?$/,
  /^\/signup\/[A-Za-z0-9_-]+$/, // Matches '/signup/{id}' for candidate sign-up
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
  /^\/assessment(\/.*)?$/, // Matches '/bot' and any subpath like '/bot/*'
  /^\/api(\/.*)?$/ // Matches '/api' and any subpath like '/api/*'
];

const staticRoutes = [
  /^\/Videos(\/.*)?$/, // Matches '/Videos' and any subpath
  /^\/images(\/.*)?$/,
  /^\/assets(\/.*)?$/,
  /\.(ico|png|jpg|jpeg|gif|svg|mp4|webm)$/ // Matches common static file extensions
];

// Combine unprotected and applicant routes
export const allUnprotectedRoutes = [
  ...unprotectedRoutes,
  ...applicantRoutes,
  ...staticRoutes
];

// Add this new function to handle SAML redirects
export async function handleSamlRedirect(request: NextRequest) {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const samlResponse = url.searchParams.get('SAMLResponse');

  if (samlResponse && provider) {
    // Ensure redirect happens to the production domain
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentora.io';
    return NextResponse.redirect(`${siteUrl}/auth/callback`);
  }

  return null;
}

export async function handleAuthRedirects(request: NextRequest, user: any) {
  console.log('[Auth Middleware] Handling auth redirects...');

  const { pathname } = request.nextUrl;
  console.log('[Auth Middleware] Checking current pathname:', pathname);
  
  // Check if it's a signup/[id] URL - these are allowed for authenticated users
  const isSignupWithId = /^\/signup\/[A-Za-z0-9_-]+$/.test(pathname);

  // Only redirect for signin and signup pages that aren't signup/[id]
  if (/^\/(signin|signup)(\/.*)?$/.test(pathname) && !isSignupWithId) {
    console.log(`[Auth Middleware] Current pathname ${pathname} is a signin/signup page and not signup/[id]`);
    console.log('[Auth Middleware] Checking if user exists:', user);
    if (user) {
      console.log('[Auth Middleware] User exists, redirecting to dashboard:', user);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('[Auth Middleware] No user found, returning null for auth redirects');
    return null;
  }

  // For protected routes, if no user is found, redirect to signin
  // Add isSignupWithId to allUnprotectedRoutes check
  if (!allUnprotectedRoutes.some((route) => route.test(pathname)) && 
      !isSignupWithId && 
      !user) {
    console.log(`[Auth Middleware] No user found, current pathname ${pathname} is protected, and not signup/[id], redirecting to signin`);
    console.log('[Auth Middleware] Redirecting user to signin:', pathname);
    return NextResponse.redirect(
      new URL('/signin', process.env.NEXT_PUBLIC_SITE_URL || request.url)
    );
  }

  console.log('[Auth Middleware] No auth redirects needed for current pathname:', pathname);
  return null;
}

export async function handleRecruiterRedirects(
  request: NextRequest,
  supabase: any,
  user: any
) {
  const { pathname } = request.nextUrl;
  const role = await getUserRole(supabase, user.id);
  const isOnboardingPage = pathname === '/settings/onboarding';
  console.log('[Middleware] Recruiter redirect:', role, pathname);
  
  // Only redirect on protected routes
  const isProtectedRoute = !allUnprotectedRoutes.some((route) => route.test(pathname));
  
  if (role === 'recruiter' && !isOnboardingPage && isProtectedRoute) {
    const { data: recruitData, error } = await supabase
      .from('recruiters')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (error || !recruitData || !recruitData.company_id) {
      return NextResponse.redirect(
        new URL('/settings/onboarding', request.url)
      );
    } else if (recruitData?.company_id) {
      const company = await getCompany(recruitData.company_id);
      if (!company?.Configured) {
        return NextResponse.redirect(
          new URL('/settings/onboarding', request.url)
        );
      }
    }
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  console.log('[Middleware] Updating session...');

  console.log("request:", request);
  
  const { supabase, response } = createMiddlewareClient(request);

  // Cache user data to avoid multiple calls
  console.log('[Middleware] Getting user session...');
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.log('[Middleware] Session error:', error.message);
  } else {
    console.log('[Middleware] User session result:', user ? 'Found user' : 'No user', user?.email || 'no email');
  }

  // Add SAML redirect handling
  const samlRedirect = await handleSamlRedirect(request);
  if (samlRedirect) return samlRedirect;

  // Handle auth redirects using cached user
  const authRedirect = await handleAuthRedirects(request, user);
  if (authRedirect) {
    return authRedirect;
  }

  // Handle recruiter-specific redirects using cached user
  if (user) {
    const recruiterRedirect = await handleRecruiterRedirects(
      request,
      supabase,
      user
    );
    if (recruiterRedirect) return recruiterRedirect;
  }

  // Add debug headers
  response.headers.set(
    'x-debug-request-path',
    request.nextUrl.pathname
  );
  response.headers.set('x-debug-message', 'Middleware executed');
  response.headers.set('x-user-present', user ? 'true' : 'false');

  return response;
}
