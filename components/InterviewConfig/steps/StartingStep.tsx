import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRecruiter } from '@/hooks/useRecruiter';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Job } from '@/types/merge';
export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
  job: Job;
}> = ({ onCompletion, job }) => {
  const { recruiter } = useRecruiter();
  const mergeJobId = job?.id;
  console.log('mergeJobId', mergeJobId);

  useEffect(() => {
    if (!job) return;
    
    const checkAndCreateJob = async () => {
      const jobExists = await doesJobExist(mergeJobId || '');
      console.log('jobExists', jobExists);
      
      console.log('recruiter has company id', recruiter?.company_id);
      console.log('job does not exist', !jobExists);
      if (!jobExists && recruiter?.company_id && mergeJobId) {
        console.log('creating job');
        const newJob = await createJob(mergeJobId, recruiter.company_id);
        console.log('newJob', newJob);
      }
    };

    checkAndCreateJob();
  }, [recruiter, job, mergeJobId]);

  if (!job) {
    return <div>No job found</div>;
  }

  async function doesJobExist(jobId: string) {
    const supabase = createClient();
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('*')
      .eq('merge_id', Number(jobId))
      .single();
    
    console.log('existingJob', existingJob);
    return !!existingJob;
  }

  async function createJob(jobId: string, companyId: string) {
    const supabase = createClient();
    return await supabase
      .from('jobs')
      .insert({
        id: jobId || undefined,
        company_id: companyId || undefined
      });
  }

  return (
    <div className="flex justify-between">
      <div className="p-3">
        <p>Job Id:{mergeJobId}</p>
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
