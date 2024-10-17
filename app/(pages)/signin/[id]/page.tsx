import Logo from '@/components/ui/icons/Logo';
import { createClient } from '@/utils/supabase/server';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SignIn({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { disable_button: boolean; role?: string };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  let viewProp: string;

  const role = searchParams.role || 'applicant';


  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}${role ? `?role=${role}` : 'applicant'}`);
  }

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }


  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <Link href="/signin">
          <Button variant="outline">Back to User Type Selection</Button>
        </Link>
      </div>
      <div className="flex justify-center flex-grow">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <Logo width="64px" height="64px" />
          </div>
          <h1>Role {searchParams.role}</h1>
          <Card shadow className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>
                {viewProp === 'choose_role'
                  ? 'Choose Your Role'
                  : viewProp === 'forgot_password'
                  ? 'Reset Password'
                  : viewProp === 'update_password'
                  ? 'Update Password'
                  : viewProp === 'signup'
                  ? `Sign up as a ${role}`
                  : `Sign in as a ${role}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewProp === 'choose_role' && (
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={() => redirect('/signin/password_signin?role=recruiter')}
                    className="w-full"
                    variant="outline"
                  >
                    Sign in as Recruiter
                  </Button>
                  <Button
                    onClick={() => redirect('/signin/password_signin?role=applicant')}
                    className="w-full"
                    variant="outline"
                  >
                    Sign in as Applicant
                  </Button>
                </div>
              )}
              {viewProp === 'password_signin' && (
                <PasswordSignIn
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role={role ?? 'default'}
                />
              )}
              {viewProp === 'email_signin' && (
                <EmailSignIn
                  allowPassword={allowPassword}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'forgot_password' && (
                <ForgotPassword
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'update_password' && (
                <UpdatePassword redirectMethod={redirectMethod} />
              )}
              {viewProp === 'signup' && (
                <SignUp
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role={searchParams.role ?? 'default'}
                />
              )}
              {viewProp !== 'update_password' &&
                viewProp !== 'signup' &&
                allowOauth && (
                  <>
                    <Separator text="Third-party sign-in" />
                    <OauthSignIn />
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}