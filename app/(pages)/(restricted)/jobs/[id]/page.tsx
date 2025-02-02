'use client';
import JobPage from '@/components/Jobs/Job';
import { useJob } from '@/hooks/useJob';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
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
    error,
    refetchJob,
    refetchApplicants 
  } = useJob(jobId);
  



  if (error) {
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
      // combinedJob={combinedJob}
      job={job || undefined} 
      applicants={applicants || []} 
      jobLoading={jobLoading}
      applicantsLoading={applicantsLoading}
    />
  )
}
