import { useState, useEffect } from 'react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useUser } from './useUser';
import { getAccountTokenFromApplication } from '@/utils/supabase/queries';
import { Application as MergeApplication, Job as MergeJob } from '@/types/merge';
import { getURL } from '@/utils/helpers';
import { fetchJobById } from '@/server/jobs';

// Hook to fetch applicant data
const useApplicantData = (userId: string | undefined): {
  applicant: Tables<'applicants'> | null;
  error: Error | null;
} => {
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
          .select(`
            *,
            AI_summary:AI_summary(*)
          `)
          .eq('applicant_id', applicantId);

        if (error) throw error;
        console.log(data);
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

export type EnrichedApplication = MergeJob & {
  company: Tables<'companies'> | null;
  application_data: Tables<'applications'>;
  ai_summary: Tables<'AI_summary'> | null;
  status: 'complete' | 'incomplete';
}


// Main hook that combines all the data
export const useApplicant = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountTokens, setAccountTokens] = useState<{[key: string]: string | null}>({});
  const [enrichedApplications, setEnrichedApplications] = useState<EnrichedApplication[] | null>(null);
  
  const { applicant, error: applicantError } = useApplicantData(user.data?.id);
  const { applications, error: applicationsError } = useApplications(applicant?.id);

  useEffect(() => {
    const enrichApplications = async () => {
      if (!applications) return;
      try {
        const tokens: {[key: string]: string | null} = {};
        const enriched: EnrichedApplication[] = [];

        for (const application of applications) {
          const {token, company} = await getAccountTokenFromApplication(application.id);
          tokens[application.id] = token;

          // Check if there's an AI summary
          const aiSummary = (application as any).ai_summaries?.[0] || null;
          const status = aiSummary ? 'complete' : 'incomplete';

          const jobDetails = await fetchJobById(application.job_id); // using functions.ts instead

          if (jobDetails) {
            enriched.push({
              ...jobDetails, 
              company, 
              application_data: application,
              ai_summary: aiSummary,
              status
            });
          } else {
            enriched.push({
              ...application as unknown as MergeJob, 
              company, 
              application_data: application,
              ai_summary: aiSummary,
              status
            });
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
    isLoading: isLoading || user.loading,
    accountTokens,
    enrichedApplications,
    error: applicantError || applicationsError
  };
};
