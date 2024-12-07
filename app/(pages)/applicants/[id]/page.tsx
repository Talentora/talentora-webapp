'use client';

import { useState, useEffect } from 'react';
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { ApplicantCandidate } from '@/types/merge';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {Tables} from "@/types/types_db";
import { createClient } from '@/utils/supabase/client';

type AI_summary = Tables<'AI_summary'>;
type Applications = Tables<'applications'>;
type Applicants = Tables<'applicants'>;

export type AI_summary_applicant = AI_summary & {
  applications: Applications & {
    applicants: Applicants;
  };
};

export default function ApplicantPage({
  params
}: {
  params: { id: string };
}) {
  const [applicantCandidate, setApplicantCandidate] = useState<ApplicantCandidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<AI_summary_applicant | null>(null);

  useEffect(() => {
    async function fetchMergeData() {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        const data = await response.json();
        setApplicantCandidate(data);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load applicant data');
      }
    }

    async function fetchDBData() {
      const supabase = createClient();
      const {data, error} = await supabase
        .from('AI_summary')
        .select(`
          *,
          applications!inner (
            *,
            applicants!inner (
              id,
              merge_applicant_id
            )
          )
        `)
        .eq('applications.applicants.merge_applicant_id', params.id)
        .single()
      if (error) {
        console.error('Error fetching AI summary:', error);
        setError('Failed to load applicant data from the database');
      }
      if (data) {
        setAiSummary(data);
      }
    }

    fetchMergeData();
    fetchDBData();
  }, [params.id]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <a 
          href="/applicants"
          className="inline-flex items-center text-primary-dark hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Applicants
        </a>
      </div>
      {!applicantCandidate ? (
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
        <ApplicantPortal ApplicantCandidate={applicantCandidate} aiSummary={aiSummary} />
      )}
    </div>
  );
}
