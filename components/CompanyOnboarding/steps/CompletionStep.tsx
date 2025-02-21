import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { updateCompany } from '@/utils/supabase/queries';
import { toast } from '@/components/Toasts/use-toast';

export const CompletionStep: React.FC = () => {
  const { company, loading } = useUser();

  useEffect(() => {
    const markConfigured = async () => {
      if (company && !loading) {
        try {
          await updateCompany(company.id, {
            Configured: true
          });
        } catch (error) {
          console.error('Error updating company configuration:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to complete company configuration.'
          });
        }
      }
    };

    markConfigured();
  }, [company, loading]);

  return (
    <div className="flex justify-between">
      <div className="text-center p-4">
        <h3 className="text-lg font-medium">You're All Set!</h3>
        <p>
          <i>Congratulations! Your account is now ready to use.</i>
        </p>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" width={500} height={300} />
      </div>
    </div>
  );
};
