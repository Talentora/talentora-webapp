'use client';
import JobPage from '@/components/Jobs/Job';
import { useJob } from '@/hooks/useJob';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

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
        <h1 className="text-2xl font-bold text-destructive">{error}</h1>
        <Button 
          onClick={() => {
            refetchJob();
            refetchApplicants();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <JobPage 
      job={job} 
      applicants={applicants} 
      jobLoading={jobLoading}
      applicantsLoading={applicantsLoading}
    />
  );
}
