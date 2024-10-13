import { NextResponse } from 'next/server';
import JobPage from '@/components/Job';
import { Job as GreenhouseJob } from '@/types/greenhouse';

interface JobPageProps {
  params: { id: string };
}

export default async function Page({ params }: JobPageProps) {
  const jobId = params.id;
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs/${jobId}`);

  if (response.ok) {
    const job: GreenhouseJob = await response.json();
    const applicantsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/applicants?jobId=${jobId}`);
    const applicants = applicantsResponse.ok ? await applicantsResponse.json() : [];

    return (
      <div>
        <JobPage job={job} applicants={applicants} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Job not found</h1>
      </div>
    );
  }
}
