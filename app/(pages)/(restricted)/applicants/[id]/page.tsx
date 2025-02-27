'use client';

import { useState, useEffect } from 'react';
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEnrichedApplicantByMergeId, fetchAllEnrichedApplicants } from '@/server/applications';
import { createClient } from '@/utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tables } from '@/types/types_db';
type AI_summary = Tables<'AI_summary'>;
export type portalProps = {
  AI_summary: AI_summary | null; 
  application: any | null;
  job_interview_config: any | null;
  mergeApplicant: any | null;
  candidate: any | null;
  job: any | null;
  interviewStages: any | null;
  hasSupabaseData: boolean;
  hasMergeData: boolean;
  hasAISummary: boolean;
}

interface emotion_eval {
    timeline: {
        face: Array<{
            time: number;
            emotions: Record<string, number>;
        }>;
    };
    averages: {
        face: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
        prosody: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
        language: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
    };
}

export type ApplicantStatus = 'unable_to_invite' | 'able_to_invite' | 'invited_incomplete' | 'invited_complete';

export default function ApplicantPage({
  params
}: {
  params: { id: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [portalProps, setPortalProps] = useState<portalProps>({
    AI_summary: null,
    application: null,
    job_interview_config: null,
    mergeApplicant: null,
    candidate: null,
    job: null,
    interviewStages: null,
    hasSupabaseData: false,
    hasMergeData: false,
    hasAISummary: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to fetch the specific applicant
        try {
          // Fetch enriched applicant data
          const enrichedData = await fetchEnrichedApplicantByMergeId(params.id);
          console.log("Enriched applicant data:", enrichedData);
          
          // Fetch job interview config if we have a job ID
          let jobConfig = null;
          if (enrichedData.job?.id) {
            const supabase = createClient();
            const { data: jobConfigData } = await supabase
              .from('job_interview_config')
              .select('*')
              .eq('job_id', enrichedData.job.id)
              .single();
            
            jobConfig = jobConfigData;
          }
          
          // Set portal props
          setPortalProps({
            AI_summary: enrichedData.AI_summary,
            application: enrichedData.application,
            job_interview_config: jobConfig,
            mergeApplicant: {
              application: enrichedData.application,
              candidate: enrichedData.candidate,
              job: enrichedData.job,
              interviewStages: enrichedData.interviewStages
            },
            candidate: enrichedData.candidate,
            job: enrichedData.job,
            interviewStages: enrichedData.interviewStages,
            hasSupabaseData: enrichedData.hasSupabaseData,
            hasMergeData: enrichedData.hasMergeData,
            hasAISummary: enrichedData.hasAISummary
          });
        } catch (specificError) {
          console.error('Error fetching specific applicant:', specificError);
          
          // If specific fetch fails, try to find the applicant in the full list
          const allApplicants = await fetchAllEnrichedApplicants();
          const matchingApplicant = allApplicants.find(
            (app: any) => app.application?.id === params.id || 
                         app.applicant?.merge_applicant_id === params.id
          );
          
          if (matchingApplicant) {
            console.log("Found applicant in full list:", matchingApplicant);
            
            // Fetch job interview config if we have a job ID
            let jobConfig = null;
            if (matchingApplicant.job?.id) {
              const supabase = createClient();
              const { data: jobConfigData } = await supabase
                .from('job_interview_config')
                .select('*')
                .eq('job_id', matchingApplicant.job.id)
                .single();
              
              jobConfig = jobConfigData;
            }
            
            // Set portal props from the matching applicant
            setPortalProps({
              AI_summary: matchingApplicant.AI_summary,
              application: matchingApplicant.application,
              job_interview_config: jobConfig,
              mergeApplicant: {
                application: matchingApplicant.application,
                candidate: matchingApplicant.candidate,
                job: matchingApplicant.job,
                interviewStages: matchingApplicant.interviewStages
              },
              candidate: matchingApplicant.candidate,
              job: matchingApplicant.job,
              interviewStages: matchingApplicant.interviewStages,
              hasSupabaseData: matchingApplicant.hasSupabaseData,
              hasMergeData: matchingApplicant.hasMergeData,
              hasAISummary: matchingApplicant.hasAISummary
            });
          } else {
            // If we still can't find the applicant, set an error
            setError('Applicant not found. The ID may be invalid or the applicant has been removed.');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load applicant data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <div className="w-full lg:w-64">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Alert variant="danger" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="text-center mt-8">
          <p className="mb-4">You can return to the applicants list to view all available applicants.</p>
          <a href="/applicants" className="text-primary hover:underline">
            Back to Applicants List
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ApplicantPortal portalProps={portalProps} />
    </div>
  );
}
