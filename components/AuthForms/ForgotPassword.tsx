'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requestPasswordUpdate } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton
}: ForgotPasswordProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestPasswordUpdate, router);
    setIsSubmitting(false);
  };

  return (
    <Card shadow className="my-8">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          noValidate={true}
          className="grid gap-2"
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
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send Email
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <p>
          <Link href="/signin/password_signin" className="font-light text-sm">
            Sign in with email and password
          </Link>
        </p>
        {allowEmail && (
          <p>
            <Link href="/signin/email_signin" className="font-light text-sm">
              Sign in via magic link
            </Link>
          </p>
        )}
        <p>
          <Link href="/signin/signup" className="font-light text-sm">
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}