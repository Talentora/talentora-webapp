import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getUserRole, getCompany } from '@/utils/supabase/queries';

// List of unprotected routes as regular expressions
export const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
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

// Combine unprotected and applicant routes
export const allUnprotectedRoutes = [...unprotectedRoutes, ...applicantRoutes];


type CookieData = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export const clearAuthCookies = (response: NextResponse) => {
  const cookieOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    httpOnly: true,
    maxAge: 0
  };

  // List of cookies to clear
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-auth-token',
    'supabase-auth-token',
    '__stripe_mid',
    '__stripe_sid',
    'preferredSignInView'
  ];

  // Clear all cookies that match our patterns
  const allCookies = response.cookies.getAll();
  allCookies.forEach(cookie => {
    if (
      cookie.name.startsWith('sb-') ||
      cookie.name.includes('supabase') ||
      cookie.name.includes('auth') ||
      cookie.name.includes('token') ||
      cookie.name.includes('session')
    ) {
      response.cookies.delete(cookie.name);
    }
  });

  // Also explicitly clear known cookies
  cookiesToClear.forEach(name => {
    response.cookies.delete(name);
  });

  return response;
};

export const createClient = (request: NextRequest) => {
  // Get the site URL from environment variable or request
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentora.io';

  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value: '',
            ...options
          });
        }
      }
    }
  );

  return { supabase, response };
};

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
  const { pathname } = request.nextUrl;
  
  // Redirect authenticated users away from signin/signup routes to /dashboard
  if (/^\/(signin|signup)(\/.*)?$/.test(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return null;
  }

  // For protected routes, if no user is found, redirect to signin
  if (!allUnprotectedRoutes.some((route) => route.test(pathname)) && !user) {
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
  console.log('[Middleware] Initial request cookies:', request.cookies.getAll());
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = request.cookies.get(name)?.value;
          console.log(`[Middleware] Getting cookie: ${name} = ${value}`);
          return value;
        },
        // set(name: string, value: string, options: CookieOptions) {
        //   console.log(`[Middleware] Setting cookie: ${name}`);
        //   request.cookies.set({ name, value, ...options });
        //   supabaseResponse = NextResponse.next({
        //     request,
        //   });
        //   supabaseResponse.cookies.set({ name, value, ...options });
        // },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = {
            ...options,
            secure: true,
            httpOnly: true,
            sameSite: 'Lax',
            path: '/'
          };
          request.cookies.set({ name, value, ...cookieOptions });
          supabaseResponse.cookies.set({ name, value, ...cookieOptions });
        },
        remove(name: string, options: CookieOptions) {
          console.log(`[Middleware] Removing cookie: ${name}`);
          request.cookies.delete(name);
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.delete(name);
        },
      }
    }

  );

  console.log('[Middleware] Created Supabase client');

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('[Middleware] Got user:', user ? 'Present' : 'None');
  console.log('[Middleware] Final response cookies:', supabaseResponse.cookies.getAll());

  // Add SAML redirect handling
  const samlRedirect = await handleSamlRedirect(request);
  if (samlRedirect) return samlRedirect;

  // Handle auth redirects
  const authRedirect = await handleAuthRedirects(request, user);
  if (authRedirect) return authRedirect;

  // Handle recruiter-specific redirects if user is authenticated
  if (user) {
    const recruiterRedirect = await handleRecruiterRedirects(request, supabase, user);
    if (recruiterRedirect) return recruiterRedirect;
  }
  // Add debug headers
  supabaseResponse.headers.set('x-debug-request-path', request.nextUrl.pathname);
  supabaseResponse.headers.set('x-debug-message', 'Middleware executed');

  return supabaseResponse;
}
