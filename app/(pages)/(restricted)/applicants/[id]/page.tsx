'use client';

import { useState, useEffect } from 'react';
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchApplicationAISummary,
  fetchApplicationMergeId
} from '@/server/applications';
import {
  getApplication,
  getApplicationByMergeId
} from '@/utils/supabase/queries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tables } from '@/types/types_db';
type AI_summary = Tables<'AI_summary'>;
export type portalProps = {
  AI_summary: AI_summary | null;
  application: any | null;
  mergeApplicant: any | null;
  candidate: any | null;
  job: any | null;
  interviewStages: any | null;
  hasSupabaseData: boolean;
  status: any | null;
};

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

export type ApplicantStatus =
  | 'not_invited'
  | 'pending_interview'
  | 'interview_completed';

export default function ApplicantPage({ params }: { params: { id: string } }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [portalProps, setPortalProps] = useState<portalProps>({
    AI_summary: null,
    application: null,
    mergeApplicant: null,
    candidate: null,
    job: null,
    interviewStages: null,
    hasSupabaseData: false,
    status: 'not_invited'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enriched applicant data

        console.log(params.id, 'params.id');

        const temp = await fetchApplicationAISummary(params.id);
        const enrichedData = temp.data;

        console.log(enrichedData, 'enricheddata');

        const application_data = await getApplicationByMergeId(params.id);
        console.log(application_data, 'application_data');

        let newStatus = portalProps.status;
        if (application_data && application_data.status) {
          newStatus = application_data.status;
          console.log(newStatus, 'newStatus');
        }

        // Set portal props
        setPortalProps({
          AI_summary: enrichedData.ai_summary,
          application: enrichedData.application,
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
          status: newStatus
        });
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
        <Alert className="mb-6 bg-destructive text-destructive-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="text-center mt-8">
          <p className="mb-4">
            You can return to the applicants list to view all available
            applicants.
          </p>
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
