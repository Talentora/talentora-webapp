import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { updateCompany, getSupabaseJobs, createJob, createApplication } from '@/utils/supabase/queries';
import { toast } from '@/components/Toasts/use-toast';
import { fetchJobsData } from '@/server/jobs';
import { fetchAllApplications } from '@/server/applications';
import { getSupabaseApplications } from '@/utils/supabase/queries';


export const CompletionStep: React.FC = () => {
  const { data, loading } = useUser().company;
  const syncPerformed = useRef(false);
  const [isSyncing, setIsSyncing] = useState(true);

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
      if (!data || loading || syncPerformed.current) return;
      
      try {
        syncPerformed.current = true;
        const jobs = await fetchJobsData();
        const existingJobs = await getSupabaseJobs();

        const jobsToCreate = jobs.filter((job: any) => !existingJobs?.some((existingJob: any) => existingJob.merge_id === job.id));

        for (const job of jobsToCreate) {
          await createJob(data.id, job.id);
        }
      } catch (error) {
        console.error('Error syncing jobs:', error);
        syncPerformed.current = false;
      }
    };

    const syncApplications = async () => {
      try {
        const applications = await fetchAllApplications();
        const existingApplications = await getSupabaseApplications();
        const applicationsToCreate = applications.filter((application: any) => 
          !existingApplications?.some((existingApplication: any) => existingApplication.merge_id === application.id)
        );

        for (const application of applicationsToCreate) {
          console.log(application);
          await createApplication(application.job.id, application.application.id);
        }
      } catch (error) {
        console.error('Error syncing applications:', error);
      } finally {
        setIsSyncing(false);
      }
    };  

    const initializeSync = async () => {
      await markConfigured();
      await Promise.all([
        syncJobs(),
        syncApplications()
      ]);
    };

    initializeSync();
  }, [data, loading]);

  return (
    <div className="flex justify-between">
      <div className="text-center p-4">
        <h3 className="text-lg font-medium">You're All Set!</h3>
        <p>
          <i>Congratulations! Your account is now ready to use.</i>
        </p>
        {isSyncing ? (
          <p className="text-sm text-muted-foreground mt-2">
            Syncing your data... This may take a few minutes.
          </p>
        ) : (
          <div className="mt-4">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
        )}
       
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" width={500} height={300} />
      </div>
    </div>
  );
};
