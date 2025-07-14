'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PasswordSignIn from '@/components/AuthForms/PasswordSignIn';
import { verifyToken, invalidateToken } from '@/utils/email_helpers';
import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function ProtectedSignInClient({ candidateId }: { candidateId: string }) {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const jobIdParam = searchParams.get('jobId');
  const applicationIdParam = searchParams.get('application');
  const { allowEmail } = getAuthTypes();
  const redirectMethod = getRedirectMethod();
  const supabase = createClientComponentClient()
  

  // Helper function to add user to both tables
  const addUserToApplicantAndApplicationTables = useCallback(async (
    userId: string,
    email: string,
    fullName: string,
    candidateId: string,
    jobId: string | null,
    applicationId: string | null
  ) => {
    // Add to applicants table
    const { error: applicantError } = await supabase
      .from('applicants')
      .upsert({
        id: userId,
        email: email,
        full_name: fullName,
        merge_candidate_id: [candidateId]
      })
      .select();
    
    if (applicantError) {
      console.error('Error adding user to applicants table:', applicantError);
    }
    
    // Add to applications table if we have a job ID and application ID
    if (jobId && applicationId) {
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ applicant_id: userId })
        .eq('merge_application_id', applicationId);
      
      if (applicationError) {
        console.error('Error updating application with applicant ID:', applicationError);
      }
    }
  }, [supabase]);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in
        
        try {
          // If we have a token and it's valid, add the user to applicants and applications tables
          if (token && isValidToken && verifiedEmail) {
            const user = session.user;
            
            // Call functions to add user to applicants and applications tables
            await addUserToApplicantAndApplicationTables(
              user.id, 
              verifiedEmail, 
              user.user_metadata.full_name, 
              candidateId,
              jobId,
              applicationId
            );
            
            // Invalidate the token after successful processing
            await invalidateToken(token);
          }
          
          // Redirect to dashboard
          router.push('/dashboard');
          router.refresh();
        } catch (err) {
          console.error('Error processing authentication:', err);
          // Still redirect to dashboard even if there's an error
          router.push('/dashboard');
          router.refresh();
        }
      }
    }
    
    checkUser()
  }, [router, supabase, isValidToken, token, verifiedEmail, candidateId, jobId, applicationId, addUserToApplicantAndApplicationTables])
  
  useEffect(() => {
    // Set job ID from query params if available
    if (jobIdParam) {
      setJobId(jobIdParam);
    }
    
    // Set application ID from query params if available
    if (applicationIdParam) {
      setApplicationId(applicationIdParam);
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
        setVerifiedEmail(response.email);
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
  }, [token, candidateId, jobIdParam, applicationIdParam]);

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
                <PasswordSignIn
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role="applicant"
                  candidateId={candidateId}
                  jobId={jobId || undefined}
                  applicationId={applicationId || undefined}
                  signUpRedirectLink={`/signup/${candidateId}?token=${token}${applicationId ? `&application=${applicationId}` : ''}`}
                  onSuccessfulSignIn={async () => {
                    if (token) {
                      await invalidateToken(token);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function ProtectedSignInPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedSignInClient candidateId={id} />
  );
}
