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
import { updateName, uploadProfilePhoto } from '@/utils/auth-helpers/server'; // Add a new helper function for uploading photo
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUser, getRecruiter } from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser';

export default function NameForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useUser();
  const userName = user?.user_metadata.full_name;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      setIsSubmitting(false);
      return;
    }

    // Handle name update
    await handleRequest(e, updateName, router);

    // Handle profile photo upload if a new image is selected
    if (profileImage) {
      await uploadProfilePhoto(profileImage, user?.id); // Adjust based on how you handle file uploads in your backend
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="p-8 pr-8 border border-input my-8 text-card-foreground">
      <CardTitle className="text-primary">Public Info</CardTitle>
      <div>This information will be publicly displayed and visible for all users.</div>


      <CardHeader className="mt-8 grid grid-cols-3 items-center">
        <CardTitle className="text-primary text-lg mx-auto font-normal col-span-1">Username</CardTitle>
        <form id="nameForm" onSubmit={handleSubmit} className="col-span-2">
          <input
            type="text"
            name="fullName"
            className="w-full p-3 rounded-md bg-input text-input-foreground"
            defaultValue={user?.user_metadata.full_name}
            placeholder={user?.user_metadata.full_name}
            maxLength={64}
          />
        </form>
      </CardHeader>

      {/* Profile Photo Upload Section */}
      <CardContent>
      <CardHeader className="grid grid-cols-3 items-center">
      <CardTitle className="text-primary text-lg mx-auto font-normal col-span-1">Avatar</CardTitle>

        <div className="my-4">
          <label htmlFor="profilePhoto" className="block text-lg font-medium text-primary"></label>
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
          />
          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
            </div>
          )}
        </div>
      </CardHeader>

      </CardContent>
      

      <CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
