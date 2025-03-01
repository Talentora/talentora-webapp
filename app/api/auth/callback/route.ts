import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  console.log('[Auth Callback] Request URL:', requestUrl.toString());
  console.log('[Auth Callback] Request cookies:', request.cookies.getAll());
  
  const code = requestUrl.searchParams.get('code');
  console.log('[Auth Callback] Auth code present:', !!code);

  if (code) {
    // Create a response with the redirect
    const response = NextResponse.redirect(
      getStatusRedirect(
        `${requestUrl.origin}/dashboard`,
        'Success!',
        'You are now signed in.'
      )
    );
    
    const supabase = createClient();

    console.log('[Auth Callback] Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('[Auth Callback] Exchange result - Error:', error);
    console.log('[Auth Callback] Exchange result - Session:', data?.session ? 'Present' : 'None');
    
    if (error) {
      console.error('[Auth Callback] Failed to exchange code:', error);
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }

    console.log('[Auth Callback] Final response cookies:', response.cookies.getAll());
    return response;
  }

  // Return the user to the dashboard if no code in request
  console.log('[Auth Callback] No code present, redirecting to dashboard');
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/dashboard`,
      'Success!',
      'You are now signed in.'
    )
  );
}

// Add POST handler to handle callback requests that use POST.
export async function POST(request: NextRequest) {
  console.log('[Auth Callback] POST request received');
  return GET(request);
}
  