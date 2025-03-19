'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';

interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
  role: string;
  prefilledEmail?: string;
  candidateId?: string;
  jobId?: string;
}

export default function SignUp({
  allowEmail,
  redirectMethod,
  role,
  prefilledEmail,
  candidateId,
  jobId
}: SignUpProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(prefilledEmail || '');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create form data with the state values
    const formData = new FormData(e.currentTarget);
    
    // Make sure to use the state values
    formData.set('email', email);
    formData.set('full_name', fullName);
    formData.set('password', password);
    formData.set('role', role);
    
    // Add candidateId and jobId if available
    if (candidateId) {
      formData.set('candidateId', candidateId);
    }
    
    if (jobId) {
      formData.set('jobId', jobId);
    }

    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              placeholder="John Doe"
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoCapitalize="words"
              className="w-full p-3 bg-background text-foreground rounded-md border border-input"
            />
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
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
          >
            {isSubmitting ? 'Signing up...' : `Sign up as ${role}`}
          </Button>
        </div>
      </form>
      {!candidateId && (
        <p>
          <Link
            href={`/signin/password_signin?role=${role}`}
            className="font-light text-sm text-muted-foreground"
          >
            Already have an account? Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
