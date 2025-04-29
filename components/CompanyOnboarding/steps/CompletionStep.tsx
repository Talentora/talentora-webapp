import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { updateCompany, getSupabaseJobs, createJob } from '@/utils/supabase/queries';
import { toast } from '@/components/Toasts/use-toast';
import { fetchJobsData } from '@/server/jobs';

export const CompletionStep: React.FC = () => {
  const { data, loading } = useUser().company;
  const syncPerformed = useRef(false);

  useEffect(() => {
    const markConfigured = async () => {
      if (data && !loading) {
        try {
          await updateCompany(data.id, {
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

    const syncJobs = async () => {
      // Only run if we have company data and haven't synced yet
      if (!data || loading || syncPerformed.current) return;
      
      try {
        syncPerformed.current = true; // Mark as performed immediately to prevent duplicate runs
        
        const jobs = await fetchJobsData();
        const existingJobs = await getSupabaseJobs();

        const jobsToCreate = jobs.filter((job: any) => !existingJobs.some((existingJob: any) => existingJob.merge_id === job.id));

        for (const job of jobsToCreate) {
          await createJob(data?.id, job.id);
        }
        
        console.log('Job sync completed successfully');
      } catch (error) {
        console.error('Error syncing jobs:', error);
        // Reset sync flag if there was an error so we can try again
        syncPerformed.current = false;
      }
    };

    markConfigured();
    syncJobs();
  }, [data, loading]);

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
