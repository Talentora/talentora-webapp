import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import { Loader2 } from 'lucide-react';
import { Job } from '@/types/merge';
import { type Database } from '@/types/types_db';

type Recruiter = Database['public']['Tables']['recruiters']['Row'];

export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
  job: Job;
}> = ({ onCompletion, job }) => {
  const { recruiter } = useUser();
  const recruiterData = recruiter.data as Recruiter;

  const mergeJobId = job?.id;

  const [state, setState] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!job) return;

    const checkAndCreateJob = async () => {
      const supabase = createClient();

      try {
        const { data: existingJob, error: fetchError } = await supabase
          .from('jobs')
          .select()
          .eq('merge_id', mergeJobId)
          .single();

        if (fetchError) {
          console.error('Fetch error:', fetchError);
          setState({ loading: false, error: 'Error fetching job, proceeding to create a new job.' });
        }

        if (!existingJob && recruiterData?.company_id) {
          const { data: newJob, error: jobError } = await supabase
            .from('jobs')
            .insert({
              merge_id: mergeJobId,
              company_id: recruiterData.company_id,
            })
            .select()
            .single();

          if (jobError) {
            throw new Error('Error creating job: ' + jobError.message);
          }
        }

        if (state.loading) {
          onCompletion(true);
        }
      } catch (error) {
        setState({ loading: false, error: (error as Error).message });
        return;
      }

      setState({ loading: false, error: null });
    };

    checkAndCreateJob();
  }, [recruiterData, job, mergeJobId, onCompletion, state.loading]);

  if (state.loading || recruiter.loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center text-red-500">
        {state.error}
      </div>
    );
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
