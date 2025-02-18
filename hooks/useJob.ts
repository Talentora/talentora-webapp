import { useState, useEffect, useMemo, useRef } from 'react';
import { EnrichedJob } from '@/components/Jobs/types';
import { ApplicantCandidate } from '@/types/merge';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://talentora.io';

const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};

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
      const jobData = await fetchWithRetry(`${baseUrl}/api/jobs/${jobId}`);
      if (isMounted.current) {
        setJob(jobData);
        setError(null);
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
      const applicantsData = await fetchWithRetry(`/api/applications?jobId=${jobId}`);
      if (isMounted.current) {
        setApplicants(applicantsData);
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
    
    // Only fetch if we have a jobId
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
    // Add refetch functions for manual retries
    refetchJob: fetchJob,
    refetchApplicants: fetchApplicants
  }), [job, applicants, jobLoading, applicantsLoading, error, fetchJob, fetchApplicants]);
}
