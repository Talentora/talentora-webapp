import { useState, useEffect, useMemo, useRef } from 'react';
import { EnrichedJob } from '@/components/Jobs/types';
import { ApplicantCandidate } from '@/types/merge';
import { fetchJobById } from '@/server/jobs';
import { fetchAllApplications } from '@/server/applications';
import { fetchJobConfigurationData } from '@/server/jobs';

export function useJob(jobId: string) {
  const [job, setJob] = useState<EnrichedJob | null>(null);
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMounted = useRef(true);

  const fetchJob = useMemo(() => async () => {
    if (!jobId) return;
    
    setJobLoading(true);
    try {
      const jobData = await fetchJobById(jobId);
      if (isMounted.current) {
        setJob(jobData);
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      }
    } finally {
      if (isMounted.current) {
        setJobLoading(false);
      }
    }
  }, [jobId]);

  const fetchApplicants = useMemo(() => async () => {
    if (!jobId) return;
    
    setApplicantsLoading(true);
    try {
      const allApps = await fetchAllApplications();
      const filteredApps = allApps.filter((app: ApplicantCandidate) => app.job.id === jobId);
      if (isMounted.current) {
        setApplicants(filteredApps);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      if (isMounted.current) {
        setApplicantsLoading(false);
      }
    }
  }, [jobId]);

  useEffect(() => {
    isMounted.current = true;
    
    if (jobId) {
      fetchJob();
      fetchApplicants();
    } else {
      setJobLoading(false);
      setApplicantsLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [jobId, fetchJob, fetchApplicants]);

  return useMemo(() => ({
    job,
    applicants,
    jobLoading,
    applicantsLoading,
    error,
    refetchJob: fetchJob,
    refetchApplicants: fetchApplicants
  }), [job, applicants, jobLoading, applicantsLoading, error, fetchJob, fetchApplicants]);
}
