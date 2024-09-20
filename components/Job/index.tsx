"use client"
import { JobHeader } from './JobHeader';
import ApplicantStatistics from './ApplicantStatistics';
import { RecentApplicants } from './RecentApplicants';
import { RoboRecruiterConfig } from './BotConfig';
import { Tables } from '@/types/types_db';
import { updateJob } from '@/utils/supabase/queries';

type Job = Tables<'jobs'>;
type Applicant = Tables<'applicants'>;

interface JobProps {
  job: Job;
  applicants: Applicant[];
}

export default function Job({ job, applicants }: JobProps) {
  const handleJobUpdate = async (updatedJobData: Job) => {
    await updateJob(job.id, updatedJobData);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <JobHeader job={job} onUpdate={handleJobUpdate}/>
      <ApplicantStatistics />
      <RecentApplicants applicants={applicants} />
      <RoboRecruiterConfig job={job} />
    </div>
  );
}