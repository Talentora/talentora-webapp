import { Metadata } from 'next';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
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
import EmailSignIn from '@/components/AuthForms/EmailSignIn';
import Separator from '@/components/AuthForms/Separator';
import OauthSignIn from '@/components/AuthForms/OauthSignIn';
import ForgotPassword from '@/components/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/AuthForms/UpdatePassword';
import SignUp from '@/components/AuthForms/Signup';
import { createClient } from '@/utils/supabase/server';
import Logo from '@/components/ui/icons/Logo';
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

  // const { user } = useUser();

  let viewProp: string;

  const role = searchParams.role;

  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
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
    <div className=" flex w-full flex-col min-h-screen">
      <div className="flex justify-center flex-1">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80">
          <div style={{"height":"80%", "display": "flex", "alignItems":"center"}} className="flex justify-center pb-6">
            <Logo width="30px" height="30px" />
          </div>
          <Card shadow className="p-4 w-full max-w-lg">
            <CardHeader>
              <CardTitle className=" text-center">
                {viewProp === 'forgot_password'
                  ? 'Reset Password'
                  : viewProp === 'update_password'
                    ? 'Update Password'
                    : viewProp === 'signup'
                      ? 'Sign Up'
                      : 'Recruiters Login'}
              </CardTitle>
            </CardHeader>
            <CardContent className='py-4 '>
              {viewProp === 'password_signin' && (
                <PasswordSignIn
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role={role || 'applicant'}
                />
              )}
              {viewProp === 'email_signin' && (
                <EmailSignIn
                  allowPassword={allowPassword}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button === 'true'}
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
              {viewProp === 'signup' && (
                <SignUp
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role={role || 'applicant'}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
