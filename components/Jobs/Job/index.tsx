'use client';
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
      <>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {job.name}
          </h1>
          <Link
            href="/jobs"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
        <JobHeader job={job} />
        <JobConfig  jobId={job.id} applicants={applicants || []} isLoading={applicantsLoading} />
      </>
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
    <div className="m-5 space-y-5">
      {jobDetailsSection}
      {applicantsSection}
    </div>
  );
}
