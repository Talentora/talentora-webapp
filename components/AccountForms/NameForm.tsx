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
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUser,getRecruiter } from '@/utils/supabase/queries';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient();
      const user = await getUser(supabase);
      if (user) {
        const recruiter = await getRecruiter(supabase, user.id);
        if (recruiter) {
          setRole('recruiter');
        } else {
          setRole('user');
        }
      }
    };

    fetchUserRole();
  }, []); 

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
    <Card className="my-8 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Your Name</CardTitle>
        <CardDescription className="text-muted-foreground">
          Please enter your full name, or a display name you are comfortable
          with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="fullName"
            className="w-full p-3 rounded-md bg-input text-input-foreground"
            defaultValue={userName}
            placeholder="Your name"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <p className="pb-4 sm:pb-0 text-muted-foreground">
          64 characters maximum
        </p>
        <Button
          variant="default"
          type="submit"
          form="nameForm"
          loading={isSubmitting}
          className="bg-button-primary text-button-primary-foreground"
        >
          Update Name
        </Button>
      </CardFooter>
    </Card>
  );
}
