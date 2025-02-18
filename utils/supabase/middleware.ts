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

const cookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 1 week
};

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
    console.log('[Middleware] Redirecting user to signin: meowww', user);
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
  console.log('[Middleware] Cookie Debug:', {
    sbAuth: request.cookies.get('sb-auth-token')?.value,
    refreshToken: request.cookies.get('sb-refresh-token')?.value,
  });

  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name);
          console.log(`[Middleware] Getting cookie ${name}:`, cookie?.value);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`[Middleware] Setting cookie ${name}:`, value);
          supabaseResponse.cookies.set({
            name,
            value,
            ...cookieOptions,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          console.log(`[Middleware] Removing cookie ${name}`);
          supabaseResponse.cookies.delete({
            name,
            ...cookieOptions,
            ...options,
          });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('[Middleware] Auth Debug:', { user: !!user, error });

  console.log('[Middleware] Got user:', user ? 'Present' : 'None');
  console.log('[Middleware] Final response cookies:', supabaseResponse.cookies.getAll());

  // Handle auth redirects
  const authRedirect = await handleAuthRedirects(request, user);
  if (authRedirect) {
    console.log('[Middleware] Redirecting user ahaha:', authRedirect.status, authRedirect.headers.get('Location'));
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

  return supabaseResponse;
}
