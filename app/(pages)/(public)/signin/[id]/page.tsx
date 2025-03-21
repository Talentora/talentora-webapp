import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader'; // Import NextTopLoader
// import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod
} from '@/utils/auth-helpers/settings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PasswordSignIn from '@/components/AuthForms/PasswordSignIn';
import ForgotPassword from '@/components/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/AuthForms/UpdatePassword';
import { createClient } from '@/utils/supabase/server';
import Logo from '@/components/ui/icons/Logo';
import RecruiterSSO from '@/components/AuthForms/RecruiterSSO';
// import { useUser } from '@/hooks/useUser';

export default async function SignInPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { role?: string; disable_button?: string };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let viewProp: string;
  const role = searchParams.role;

  // Handle candidate ID case - redirect to specialized protected route
  if (params.id && params.id !== 'password_signin' && 
      params.id !== 'email_signin' && params.id !== 'forgot_password' && 
      params.id !== 'update_password' && params.id !== 'signup') {
    return redirect(`/signin/${params.id}/protected${searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ''}`);
  }

  // Filter out signup from valid view types for this route
  const signInViewTypes = viewTypes.filter(type => type !== 'signup');

  if (typeof params.id === 'string' && signInViewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    
    // Redirect to signup page if signup is requested
    if (params.id === 'signup') {
      return redirect(`/signup${role ? `?role=${role}` : ''}`);
    }
    
    return redirect(
      `/signin/${viewProp}${role ? `?role=${role}` : '?role=applicant'}`
    );
  }

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="flex flex-col min-h-screen justify-center mx-auto">
      <div className="flex justify-center flex-1">
        <div className="flex flex-col justify-between max-w-5xl p-3 m-auto w-full">
          <Card className="w-full border-none">
            <CardContent className="text-foreground">
              {role === 'recruiter' ? (
                <RecruiterSSO />
              ) : (
                <>
                  {viewProp === 'password_signin' && (
                    <PasswordSignIn
                      allowEmail={allowEmail}
                      redirectMethod={redirectMethod}
                      role={role || 'applicant'}
                    />
                  )}
                  {viewProp === 'forgot_password' && (
                    <ForgotPassword
                      allowEmail={allowEmail}
                      redirectMethod={redirectMethod}
                      disableButton={searchParams.disable_button === 'true'}
                    />
                  )}
                  {viewProp === 'update_password' && (
                    <UpdatePassword redirectMethod={redirectMethod} />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
