'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
  role: string;
  prefilledEmail?: string;
  candidateId?: string;
  jobId?: string;
  applicationId?: string;
  signUpRedirectLink?: string;
  onSuccessfulSignIn?: () => Promise<void>;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod,
  role,
  prefilledEmail,
  candidateId,
  jobId,
  applicationId,
  signUpRedirectLink,
  onSuccessfulSignIn
}: PasswordSignInProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('hello from PasswordSignIn');
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Make sure to use state values
      formData.set('email', email);
      formData.set('password', password);
      formData.set('role', role);

      // Add candidateId and jobId if available
      if (candidateId) {
        formData.set('candidateId', candidateId);
      }

      if (jobId) {
        formData.set('jobId', jobId);
      }

      // Add applicationId if available
      if (applicationId) {
        formData.set('applicationId', applicationId);
      }

      const response = await handleRequest(e, signInWithPassword, router);

      console.log('signInWithPassword response:', response);

      // If sign-in was successful, call the callback if provided
      if (response === true && onSuccessfulSignIn) {
        console.log('Calling onSuccessfulSignIn callback');
        await onSuccessfulSignIn();
      }

      // Force a hard refresh after successful sign-in
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-8 w-1/3 mx-auto border shadow-lg rounded-xl p-10">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Sign in to your account
      </h1>
      <form
        noValidate={true}
        className="mb-4 grid gap-2"
        onSubmit={(e) => {
          console.log('Form submitted');
          handleSubmit(e);
        }}
      >
        <input type="hidden" name="role" value={role || 'applicant'} />
        {candidateId && (
          <input type="hidden" name="candidateId" value={candidateId} />
        )}
        {jobId && <input type="hidden" name="jobId" value={jobId} />}
        {applicationId && (
          <input type="hidden" name="applicationId" value={applicationId} />
        )}
        <div className="grid gap-1">
          <label htmlFor="email" className="text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!prefilledEmail}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className={`w-full p-3 rounded-md border ${
              prefilledEmail ? 'bg-muted' : 'bg-background'
            } text-foreground border-input`}
          />
          <label htmlFor="password" className="text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full p-3 bg-background text-foreground rounded-md border border-input"
          />
        </div>
        <Button
          variant="default"
          type="submit"
          className="mt-1 w-full"
          disabled={isSubmitting}
          onClick={() => console.log('Button clicked!')}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p>
        <Link
          href={`/signin/forgot_password?role=${role}`}
          className="font-light text-sm text-muted-foreground"
        >
          Forgot your password?
        </Link>
      </p>
      <p>
        {role === 'applicant' ? (
          <Link
            href={
              signUpRedirectLink ? signUpRedirectLink : `/signup?role=${role}`
            }
            className="font-light text-sm text-muted-foreground"
          >
            Don&apos;t have an account? Sign up
          </Link>
        ) : (
          <>
            <Link
              href={signUpRedirectLink ? signUpRedirectLink : `/contact`}
              className="font-light text-sm text-muted-foreground"
            >
              Contact sales
            </Link>
            <br />
            <Link
              href={
                signUpRedirectLink
                  ? signUpRedirectLink
                  : `/signup?role=${role}`
              }
              className="font-light text-sm text-muted-foreground"
            >
              Company initial sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
