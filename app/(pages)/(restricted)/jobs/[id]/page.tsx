'use client';
import JobPage from '@/components/Jobs/Job';
import { useJob } from '@/hooks/useJob';
import { Alert, AlertDescription } from '@/components/ui/alert';
interface JobPageProps {
  params: { id: string };
}

export default function Page({ params }: JobPageProps) {
  const jobId = params.id;
  const { 
    job, 
    applicants, 
    jobLoading, 
    applicantsLoading, 
    error
  } = useJob(jobId);
  



  if (error || job === null) {
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
      job={job} 
      applicants={applicants || []} 
      jobLoading={jobLoading}
      applicantsLoading={applicantsLoading}
    />
  )
}
