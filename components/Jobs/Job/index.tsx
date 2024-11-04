'use client';
import { JobHeader } from './JobHeader';
import ApplicantStatistics from './ApplicantStatistics';
import { RecentApplicants } from './RecentApplicants';
import { BotConfig } from './BotConfig';
import { Job } from '@/types/merge';
import JobConfig from './JobConfig';
import { ApplicantCandidate } from '@/types/merge';
interface JobProps {
  job: Job;
  applicants: ApplicantCandidate[];
}

export default function JobPage({ job, applicants }: JobProps) {
  return (
    <div className="container mx-auto">
      <JobHeader job={job} />
      <RecentApplicants applicants={applicants} />
      <JobConfig jobId={job.id} />
      <BotConfig job={job} />
    </div>
  );
}
