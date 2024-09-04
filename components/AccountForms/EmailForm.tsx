'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { updateEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({
                                    userEmail
                                  }: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    await handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card shadow className="my-8">
      <CardHeader>
        <CardTitle>Your Email</CardTitle>
        <CardDescription>
          Please enter the email address you want to use to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="newEmail"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userEmail ?? ''}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <p className="pb-4 sm:pb-0">We will email you to verify the change.</p>
        <Button
          variant="default"
          type="submit"
          form="emailForm"
          loading={isSubmitting}
        >
          Update Email
        </Button>
      </CardFooter>
    </Card>
  );
}
