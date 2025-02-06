'use client';

import { useState, useEffect } from 'react';
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { ApplicantCandidate } from '@/types/merge';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {Tables} from "@/types/types_db";
import { createClient } from '@/utils/supabase/client';

export type portalProps = {
  AI_summary: Tables<'AI_summary'> | null; 
  application: Tables<'applications'> | null;
  job_interview_config: Tables<'job_interview_config'> | null;
  mergeApplicant: ApplicantCandidate | null;
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
    mergeApplicant: null
  });

  const fetchMergeData = async () => {
    const response = await fetch(`/api/applications/${params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch applicant data');
    }
    const data = await response.json();
    setPortalProps(prev => ({...prev, mergeApplicant: data}));
    return data;
  };

  const fetchJobConfig = async (merge_job_id: string) => {
    const supabase = createClient();
    const {data: jobConfigData} = await supabase
      .from('job_interview_config')
      .select('*')
      .eq('job_id', merge_job_id)
      .single();

    setPortalProps(prev => ({...prev, job_interview_config: jobConfigData || null}));
    return jobConfigData;
  };

  const fetchApplication = async (merge_applicant_id: string) => {
    const supabase = createClient();
    const {data: applicationData} = await supabase
      .from('applications')
      .select(`
        *,
        applicants(*)
      `)
      .eq('applicants.merge_applicant_id', merge_applicant_id)
      .single();

    setPortalProps(prev => ({...prev, application: applicationData || null}));
    return applicationData;
  };

  const fetchAISummary = async (application_id: string) => {
    const supabase = createClient();
    const {data: aiSummaryData} = await supabase
      .from('AI_summary')
      .select('*')
      .eq('application_id', application_id)
      .single();

    setPortalProps(prev => ({...prev, AI_summary: aiSummaryData || null}));
    return aiSummaryData;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Merge data first
        const mergeData = await fetchMergeData();
        
        if (!mergeData?.application?.id || !mergeData?.job?.id) {
          throw new Error('No applicant or job found');
        }

        // Fetch remaining data in parallel
        await Promise.all([
          fetchJobConfig(mergeData.job.id),
          fetchApplication(mergeData.application.id).then(appData => {
            if (appData?.id) {
              return fetchAISummary(appData.id);
            }
          })
        ]);


      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [params.id]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
     
      {loading ? (
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
      ) : (
        <div>
         
          <ApplicantPortal portalProps={portalProps} />
        </div>
      )}
    </div>
  );
}
