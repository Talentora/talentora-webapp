import { useState, useEffect, useMemo, useRef } from 'react';
import { EnrichedJob } from '@/components/Jobs/JobList';
import { ApplicantCandidate } from '@/types/merge';

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
      console.log('Fetching job:', jobId); // Debug log
      const response = await fetch(`./api/jobs/${jobId}`);
      console.log('Job response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job: ${response.statusText}`);
      }
      
      const jobData = await response.json();
      console.log('Job data received:', jobData); // Debug log
      
      if (isMounted.current) {
        setJob(jobData);
      }
    } catch (err) {
      console.error('Error fetching job:', err); // Debug log
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
      console.log('Fetching applicants for job:', jobId); // Debug log
      const response = await fetch(`./api/applications?jobId=${jobId}`);
      console.log('Applicants response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applicants: ${response.statusText}`);
      }
      
      const applicantsData = await response.json();
      console.log('Applicants data received:', applicantsData); // Debug log
      
      if (isMounted.current) {
        setApplicants(applicantsData);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      // Don't set error state for applicants failure
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

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (jobLoading || applicantsLoading) {
        setJobLoading(false);
        setApplicantsLoading(false);
        if (!error) {
          setError('Request timed out');
        }
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [jobLoading, applicantsLoading, error]);

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
