import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  console.log("requestUrl", requestUrl);
  const code = requestUrl.searchParams.get('code');
  console.log("code", code);

  if (code) {
    const supabase = createClient();
    console.log("supabase", supabase);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("error", error);

    if (error) {
      console.log("error", error);
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }
  console.log("requestUrl.origin", requestUrl.origin);

  // URL to redirect to after sign in process completes
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
  // For simplicity, we forward POST requests to the GET handler.
  console.log("POST request received");
  return GET(request);
}
