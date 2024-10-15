'use client';
import { JobHeader } from './JobHeader';
import ApplicantStatistics from './ApplicantStatistics';
import { RecentApplicants } from './RecentApplicants';
import { BotConfig } from './BotConfig';
import { Job } from '@/types/greenhouse';

import { Application } from '@/types/greenhouse';
interface JobProps {
  job: Job;
  applicants: Application[];
}

export default function JobPage({ job, applicants }: JobProps) {
  return (
    <div className="container mx-auto">
      <JobHeader job={job} />
      {/* <ApplicantStatistics /> */}
      <RecentApplicants applicants={applicants} />
      <BotConfig job={job} />
    </div>
  );
}