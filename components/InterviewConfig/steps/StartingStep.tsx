import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRecruiter } from '@/hooks/useRecruiter';
import { Loader2 } from 'lucide-react';
import { Job } from '@/types/merge';

export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
  job: Job;
}> = ({ onCompletion, job }) => {
  const { recruiter } = useRecruiter();
  const mergeJobId = job?.id;

  useEffect(() => {
    if (!job) return;

    const checkAndCreateJob = async () => {
      const jobExists = await doesJobExist(mergeJobId || '');

      if (!jobExists && recruiter?.company_id && mergeJobId) {
        console.log('creating job');
        const newJob = await createJob(mergeJobId, recruiter.company_id);
        console.log('newJob', newJob);
      }
    };

    checkAndCreateJob();
  }, [recruiter, job, mergeJobId]);
  if (!job) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  async function doesJobExist(jobId: string) {
    const supabase = createClient();
    const { data: existingJob } = await supabase
      .from('jobs')
      .select()
      .eq('merge_id', Number(jobId))
      .single();

    return !!existingJob;
  }

  async function createJob(jobId: string, companyId: string) {
    const supabase = createClient();
    const { data: newJob, error: jobError } = await supabase
      .from('jobs')
      .insert({
        merge_id: jobId, // Keep as string since it's a UUID
        company_id: companyId, // Already a UUID string
      })
      .select()
      .single();

    if (jobError) {
      throw new Error('Error creating job: ' + jobError.message);
    }

    onCompletion(true);

    return newJob;
  }

  return (
    <div className="flex justify-between">
      <div className="p-3">
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>Select this role's AI interviewer</li>
          <li>Add a description of the role</li>
          <li>Configure the interview</li>
          <li>Enter interview questions</li>
          <li>Review and publish</li>
          <li>Invite candidates!</li>
        </ul>
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" />
      </div>
    </div>
  );
};
