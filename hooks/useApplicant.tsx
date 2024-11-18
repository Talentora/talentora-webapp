import { useState, useEffect } from 'react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useUser } from './useUser';
import { getAccountTokenFromApplication } from '@/utils/supabase/queries';

// Hook to fetch applicant data
const useApplicantData = (userId: string | undefined) => {
  const [applicant, setApplicant] = useState<Tables<'applicants'> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setApplicant(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch applicant'));
        setApplicant(null);
      }
    };

    fetchApplicant();
  }, [userId, supabase]);

  return { applicant, error };
};

// Hook to fetch applications for an applicant
const useApplications = (applicantId: string | undefined) => {
  const [applications, setApplications] = useState<Tables<'applications'>[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!applicantId) return;

      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('applicant_id', applicantId);

        if (error) throw error;
        setApplications(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
        setApplications(null);
      }
    };

    fetchApplications();
  }, [applicantId, supabase]);

  return { applications, error };
};

// Helper function to fetch job details
const fetchJobDetails = async (jobId: string, token: string) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      headers: { 'X-Account-Token': token }
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
};

// Main hook that combines all the data
export const useApplicant = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountTokens, setAccountTokens] = useState<{[key: string]: string | null}>({});
  const [enrichedApplications, setEnrichedApplications] = useState<Tables<'applications'>[] | null>(null);
  
  const { applicant, error: applicantError } = useApplicantData(user?.id);
  console.log("applicant",applicant)
  const { applications, error: applicationsError } = useApplications(applicant?.id);
  console.log("applications",applications)

  useEffect(() => {
    const enrichApplications = async () => {
      if (!applications) return;

      try {
        const tokens: {[key: string]: string | null} = {};
        const enriched = [];

        console.log("applications before for loop",applications)
        for (const application of applications) {
          const {token,company} = await getAccountTokenFromApplication(application.id);
          console.log("token",token)
          tokens[application.id] = token;

          if (token) {
            const jobDetails = await fetchJobDetails(application.job_id, token);
            console.log("jobDetails",jobDetails)
            enriched.push({...jobDetails,company:company});
          } else {
            enriched.push(application);
          }
        }

        setAccountTokens(tokens);
        setEnrichedApplications(enriched);
      } catch (err) {
        console.error('Error enriching applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    enrichApplications();
  }, [applications]);

  return {
    applications,
    isLoading,
    error: applicantError || applicationsError,
    applicant,
    enrichedApplications
  };
};
