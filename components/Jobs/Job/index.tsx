'use client';
import InterviewQuestions from './InterviewQuestions'; // Update the path based on your structure
import { useEffect, useState, useCallback } from 'react';

import { JobHeader } from './JobHeader';
import { RecentApplicants } from './RecentApplicants';
import { EnrichedJob } from '../JobList';
import JobConfig from './JobConfig';
import { ApplicantCandidate } from '@/types/merge';
import { 
  JobHeaderSkeleton, 
  RecentApplicantsSkeleton, 
  JobConfigSkeleton,
  BotConfigSkeleton 
} from './JobSkeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface JobProps {
  job?: EnrichedJob;
  applicants?: ApplicantCandidate[];
  jobLoading: boolean;
  applicantsLoading: boolean;
}

export default function JobPage({ 
  job, 
  applicants, 
  jobLoading, 
  applicantsLoading 
}: JobProps) {
  // Memoize the job details section
  const jobDetailsSection = useMemo(() => {
    if (jobLoading) {
      return (
        <>
          <JobHeaderSkeleton />
          <JobConfigSkeleton />
          <BotConfigSkeleton />
        </>
      );
    }

    if (!job) return null;

    return (
      <div className="flex justify-between items-center">
        
        {/* Add any other content for job details */}
      </div>
    );
  }, [job, jobLoading, applicants]);

  // Memoize the applicants section
  const applicantsSection = useMemo(() => {
    if (applicantsLoading) {
      return <RecentApplicantsSkeleton />;
    }

    if (!applicants) return null;

    return <RecentApplicants applicants={applicants} />;
  }, [applicants, applicantsLoading]);

  return (
    <div className="pr-16 m-5 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Right Column (Wider) */}
        <div className="col-span-2 space-y-5">
          {jobDetailsSection}
          {!jobLoading && job && <JobHeader job={job} />}
          
          {applicantsSection}
        </div>

        {/* Left Column */}
        <div className="space-y-5 ">
          {!jobLoading && job && (
            <JobConfig
              jobId={job.id}
              applicants={applicants || []}
              isLoading={applicantsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
