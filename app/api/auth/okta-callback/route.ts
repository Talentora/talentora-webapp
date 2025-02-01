import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    // For SAML, Okta will POST the assertion to this route.
    // For OAuth/OIDC, you might receive query parameters or a code in GET requests.
    // Adjust accordingly for your protocol.

    // 1. Parse the incoming data if SAML:
    // const formData = await request.formData();
    // const samlResponse = formData.get('SAMLResponse');
    // Then decode/verify SAML assertion (if doing a custom flow).
    // 
    // If using OAuth code exchange:
    // const { searchParams } = new URL(request.url);
    // const code = searchParams.get('code');
    // etc.

    // 2. Example: Use Supabase client to exchange code for a session (if OAuth).
    //    If you're doing SAML with Supabase's built-in endpoints, you might not need this.
    const supabase = createClient();
    // const { error } = await supabase.auth.exchangeCodeForSession(code);

    // if (error) {
    //   return NextResponse.redirect(
    //     getErrorRedirect(
    //       `${request.nextUrl.origin}/signin`,
    //       error.name,
    //       "Sorry, we weren't able to log you in. Please try again."
    //     )
    //   );
    // }

    // 3. Redirect user to a successful post-login page
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error: any) {
    // If there's any error, redirect to sign-in page with an error message
    return NextResponse.redirect(
      getErrorRedirect(
        `${request.nextUrl.origin}/signin`,
        error?.name ?? 'Callback Error',
        error?.message ?? "Sorry, we couldn't log you in through Okta."
      )
    );
  }
}

export async function GET(request: NextRequest) {
  // Some IdP (OAuth) might use GET for the callback with a `code` param
  // If Okta is redirecting via GET, handle code exchange here.
  // Otherwise, you can remove or merge this with POST logic.
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(`${baseUrl}/dashboard`);
}
