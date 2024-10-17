import { Metadata } from 'next';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import Loading from '@/components/Loading';
import NextTopLoader from 'nextjs-toploader'; // Import NextTopLoader
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
import Link from 'next/link';
import Logo from '@/components/icons/Logo';

const title = 'Talentora';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
  },
};

export default async function RootLayout({ children, params, searchParams }: PropsWithChildren & { params: { id: string }, searchParams: { disable_button: boolean }}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  let viewProp: string;

  const role = searchParams.role || 'applicant';


  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView = cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}${role ? `?role=${role}` : 'applicant'}`);
  }

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }


  return (
    <html lang="en">
      <body className="w-full bg-background p-0 m-0">
        <NextTopLoader />
        <Navbar />
        <div className="flex">
          <aside className="w-200 bg-gray-100 p-0">
             
          </aside>
          <main id="skip" className="flex-1 min-h-[calc(100vh-4rem)] p-6">
            <div className="flex w-full flex-col min-h-screen">
              <div className="flex justify-center flex-1">
                <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80">
                  <div className="flex justify-center pb-6">
                    <Logo width="30px" height="30px" />
                  </div>
                  <Card shadow className="w-full max-w-lg">
                    <CardHeader>
                      <CardTitle className="text-black text-center">
                        {viewProp === 'forgot_password'
                          ? 'Reset Password'
                          : viewProp === 'update_password'
                          ? 'Update Password'
                          : viewProp === 'signup'
                          ? 'Sign Up'
                          : 'Recruiter Portal'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-black">
                      {viewProp === 'password_signin' && (
                        <PasswordSignIn
                          allowEmail={allowEmail}
                          redirectMethod={redirectMethod}
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
                        />
                      )}
                      {viewProp !== 'update_password' && viewProp !== 'signup' && allowOauth && (
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
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </main>
        </div>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}