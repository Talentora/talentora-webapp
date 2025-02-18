'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/utils/supabase/client';

export default function EmailForm() {
  const router = useRouter();
  const { user: { data: user } } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const userEmail = user?.email;
  const role = user?.user_metadata?.role;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get('newEmail') as string;
    
    // Check if the new email is the same as the old email
    if (newEmail === userEmail) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="my-8 text-card-foreground border-none">
      <CardHeader>
        <CardTitle>Your Email</CardTitle>
        <CardDescription className="text-muted-foreground">
          Please enter the email address you want to use to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="emailForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="newEmail"
            className="w-full p-3 rounded-md bg-input text-input-foreground"
            defaultValue={userEmail ?? ''}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <p className="pb-4 sm:pb-0 text-muted-foreground">
          We will email you to verify the change.
        </p>
        <Button
          variant="default"
          type="submit"
          form="emailForm"
          disabled={isSubmitting}
          className="bg-background text-foreground border border-border"
        >
          {isSubmitting ? 'Updating...' : 'Update Email'}
        </Button>
      </CardFooter>
    </Card>
  );
}
