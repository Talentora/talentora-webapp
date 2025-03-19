'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PasswordSignIn from '@/components/AuthForms/PasswordSignIn';
import { verifyToken } from '@/utils/email_helpers';
import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TokenProtectedSignIn({
  params
}: {
  params: { id: string };
}) {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const candidateId = params.id;
  const jobIdParam = searchParams.get('jobId');
  const { allowEmail } = getAuthTypes();
  const redirectMethod = getRedirectMethod();

  useEffect(() => {
    // Set job ID from query params if available
    if (jobIdParam) {
      setJobId(jobIdParam);
    }
    
    const validateToken = async () => {
      if (!token) {
        setError('Missing authentication token');
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyToken(token, candidateId);
        setEmail(response.email);
        setIsValidToken(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Token validation error:', err);
        setError('Invalid or expired authentication link');
        setIsValidToken(false);
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, candidateId, jobIdParam]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="mb-6 bg-destructive text-destructive-foreground">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {error || 'Invalid authentication link. Please request a new one.'}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button onClick={() => router.push('/signin')}>
                Return to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center mx-auto">
      <div className="flex justify-center flex-1">
        <div className="flex flex-col justify-between max-w-5xl p-3 m-auto w-full">
          <Card className="w-full border-none">
            <CardContent className="text-foreground">
              <div className="my-8">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Sign In to Your Account
                </h2>
                <p className="text-center text-muted-foreground mb-6">
                  {email ? `Welcome back, ${email}` : 'Welcome back!'}
                </p>
                <PasswordSignIn 
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role="applicant"
                  prefilledEmail={email || undefined}
                  candidateId={candidateId}
                  jobId={jobId || undefined}
                />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account yet?
                  </p>
                  <Link 
                    href={`/signup/${candidateId}?token=${token}${jobId ? `&jobId=${jobId}` : ''}`}
                    className="text-sm underline hover:text-primary"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
