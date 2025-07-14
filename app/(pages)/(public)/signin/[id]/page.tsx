import '@/styles/main.css';
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
import { createClient } from '@/utils/supabase/client';
// import { useUser } from '@/hooks/useUser';

export default async function SignInPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; disable_button?: string }>;
}) {
  const { id } = await params;
  const { role, disable_button } = await searchParams;
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const finalRole = role || cookieStore.get('role')?.value;

  let viewProp: string;

  // Handle candidate ID case - redirect to specialized protected route
  if (id && id !== 'password_signin' && 
      id !== 'email_signin' && id !== 'forgot_password' && 
      id !== 'update_password' && id !== 'signup') {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (disable_button) params.set('disable_button', disable_button);
    return redirect(`/signin/${id}/protected${params.toString() ? `?${params.toString()}` : ''}`);
  }

  // Filter out signup from valid view types for this route
  const signInViewTypes = viewTypes.filter(type => type !== 'signup');

  if (typeof id === 'string' && signInViewTypes.includes(id)) {
    viewProp = id;
  } else {
    const preferredSignInView =
      (await cookies()).get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    
    // Redirect to signup page if signup is requested
    if (id === 'signup') {
      return redirect(`/signup${finalRole ? `?role=${finalRole}` : ''}`);
    }
    
    return redirect(
      `/signin/${viewProp}${finalRole ? `?role=${finalRole}` : '?role=applicant'}`
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
                // <RecruiterSSO />
                <PasswordSignIn
                allowEmail={allowEmail}
                redirectMethod={redirectMethod}
                role={role || 'recruiter'}
              />
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
                      disableButton={disable_button === 'true'}
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
