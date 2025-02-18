'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';

interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
  role: string;
}

export default function SignUp({
  allowEmail,
  redirectMethod,
  role
}: SignUpProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Append role to form data
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

    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <Card className="my-8 w-1/2 mx-auto items-center justify-center bg-background p-5">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
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
                autoCapitalize="words"
                className="w-full p-3 text-foreground rounded-md bg-input"
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="w-full p-3 text-foreground rounded-md bg-input"
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full p-3 rounded-md text-foreground bg-input"
              />
            </div>
            <Button
              variant="default"
              type="submit"
              className="mt-1 w-full"
              // loading={isSubmitting}
            >
              Sign up as {role}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <p>Already have an account?</p>
        <Link
          href={`/signin/password_signin?role=${role}`}
          className="font-light text-sm"
        >
          Sign in with email and password
        </Link>
      </CardFooter>
    </Card>
  );
}
