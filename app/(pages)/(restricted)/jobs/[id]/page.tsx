'use client'

import JobPage from '@/components/Jobs/Job';
import { useJob } from '@/hooks/useJob';
import { Alert, AlertDescription } from '@/components/ui/alert';

function JobPageClient({ jobId }: { jobId: string }) {
  const { 
    job, 
    applicants, 
    jobLoading, 
    applicantsLoading, 
    error
  } = useJob(jobId);



  if ((error || job === null) && !jobLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Alert intent="danger" title="Error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
       
      </div>
    );
  }

  return (
    <JobPage 
      job={job || undefined} 
      applicants={applicants || []} 
      jobLoading={jobLoading}
      applicantsLoading={applicantsLoading}
    />
  )
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <JobPageClient jobId={id} />;
}
