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
import { getUser, getRecruiter } from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser';

export default function NameForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const userName = user?.user_metadata.full_name;

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
    <Card className="my-8 text-card-foreground border-none">
      <CardHeader>
        <CardTitle  >Your Name</CardTitle>
        <CardDescription className="text-muted-foreground">
          Please enter your full name, or a display name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="fullName"
            className="w-full p-3 rounded-md bg-input text-input-foreground"
            defaultValue={user?.user_metadata.full_name}
            placeholder={user?.user_metadata.full_name}
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
          className="bg-white text-black border border-gray-300"
        >
          Update Name
        </Button>
      </CardFooter>
    </Card>
  );
}
