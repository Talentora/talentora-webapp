'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AssessmentCount from './JobConfig/AssessmentCount';

import { JobHeader } from './JobHeader';
import { RecentApplicants } from './RecentApplicants';
import { EnrichedJob } from '../JobList';
import JobConfig from './JobConfig';
import InterviewQuestions from './InterviewQuestions';
import { ApplicantCandidate } from '@/types/merge';
import { 
  JobHeaderSkeleton, 
  RecentApplicantsSkeleton, 
  JobConfigSkeleton,
  BotConfigSkeleton 
} from './JobSkeleton';

interface JobProps {
  job?: EnrichedJob;
  applicants?: ApplicantCandidate[];
  jobLoading: boolean;
  applicantsLoading: boolean;
  // combinedJob: any;
}

export default function JobPage({ 
  job, 
  applicants, 
  jobLoading, 
  applicantsLoading,
  // combinedJob
}: JobProps) {
  // Memoized sections
  const jobDetailsSection = useMemo(() => {
    if (jobLoading) {
      return (
        <div className="flex flex-row gap-5 w-full">
          <div className="flex-1">
            <JobHeaderSkeleton />
          </div>
          <div className="flex-1 space-y-5">
            <JobConfigSkeleton />
            <BotConfigSkeleton />
          </div>
        </div>
      );
    }

    if (!job) return null;

    return (
      <div className="flex justify-between items-center">
        {/* Add any other content for job details */}
      </div>
    );
  }, [job, jobLoading, applicants]);

  const applicantsSection = useMemo(() => {
    if (applicantsLoading) {
      return <RecentApplicantsSkeleton />;
    }

    if (!applicants) return null;

    return (
      <div className="pt-3 space-y-5">
        <RecentApplicants applicants={applicants} jobs={[]} />
      </div>
    );
  }, [applicants, applicantsLoading]);

  return (
    <div className="pr-5 pt-3 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column (Wider) */}
        <div className="col-span-2">
          {jobDetailsSection}
          {!jobLoading && job && <JobHeader job={job} />}
          {applicantsSection}
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-5">
          {!jobLoading && job && (
            <>
              <JobConfig
                // jobId={job.id}
                job={job}
                applicants={applicants || []}
                isLoading={applicantsLoading}
              />
              <AssessmentCount 
                loading={jobLoading}
                interviewConfig={null}
                jobId={job.id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
