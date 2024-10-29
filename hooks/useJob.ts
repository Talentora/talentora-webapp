import { useEffect, useState } from 'react';
import { Job, ApplicantCandidate } from '@/types/merge';

export const useJob = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Job not found');
        const jobData: Job = await response.json();
        setJob(jobData);

        const applicantsResponse = await fetch(
          `/api/applications?jobId=${jobId}`
        );
        console.log('applicantsResponse', applicantsResponse);
        const applicantsData = await applicantsResponse.json();
        console.log('applicantsData', applicantsData);
        setApplicants(applicantsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  return { job, applicants, loading, error };
};
