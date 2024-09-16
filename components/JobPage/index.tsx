"use client"

import { useState } from 'react';
import { JobHeader } from './JobHeader';
import { JobDetails } from './JobDetails';
import ApplicantStatistics from './ApplicantStatistics';
import { RecentApplicants } from './RecentApplicants';
import { RoboRecruiterConfig } from './BotConfig';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;
type Applicant = Tables<'applicants'>

interface JobPageProps {
  job: Job;
  applicants: Applicant[];
}

export default function JobPage({ job, applicants }: JobPageProps) {
  

  

  return (
    <div className="container mx-auto p-4 space-y-8">
      <JobHeader
        job={job}
      />
      <JobDetails 
        job={job} 
      />
      <ApplicantStatistics />
      <RecentApplicants
        applicants={applicants}
      />
      <RoboRecruiterConfig
        job={job}
      />
    </div>
  );
}
