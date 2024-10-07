'use client';
import { JobHeader } from './JobHeader';
import ApplicantStatistics from './ApplicantStatistics';
import { RecentApplicants } from './RecentApplicants';
import { BotConfig } from './BotConfig';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;
type Applicant = Tables<'applicants'>;

interface JobProps {
  job: Job;
  applicants: Applicant[];
}

export default function Job({ job, applicants }: JobProps) {
  return (
    <div className="container mx-auto">
      <JobHeader job={job} />
      <ApplicantStatistics />
      <RecentApplicants applicants={applicants} />
      <BotConfig job={job} />
    </div>
  );
}
