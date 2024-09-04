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
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    await handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card shadow className="my-8">
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          Please enter your full name, or a display name you are comfortable with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="fullName"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userName}
            placeholder="Your name"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <p className="pb-4 sm:pb-0">64 characters maximum</p>
        <Button
          variant="default"
          type="submit"
          form="nameForm"
          loading={isSubmitting}
        >
          Update Name
        </Button>
      </CardFooter>
    </Card>
  );
}
