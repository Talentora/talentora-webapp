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
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod,
  role
  // userType
}: PasswordSignInProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('role', role);
    e.currentTarget = e.currentTarget.cloneNode(true) as HTMLFormElement;
    e.currentTarget.appendChild(
      Object.assign(document.createElement('input'), {
        type: 'hidden',
        name: 'role',
        value: role
      })
    );
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4 grid gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="name@example.com"
            type="email"
            name="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="w-full p-3 text-foreground  rounded-md bg-zinc-800"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            className="w-full p-3 text-foreground rounded-md bg-zinc-800"
          />
        </div>
        <Button
          variant="default"
          type="submit"
          className="mt-1 w-full"
          loading={isSubmitting}
        >
          Sign in
        </Button>
      </form>
      <p>
        <Link
          href={`/signin/forgot_password?role=${role}`}
          className="font-light text-sm"
        >
          Forgot your password?
        </Link>
      </p>
      <p>
        <Link
          href={`/signin/signup?role=${role}`}
          className="font-light text-sm"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </p>
    </div>
  );
}
