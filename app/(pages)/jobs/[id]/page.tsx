"use client"
import { NextResponse } from 'next/server';
import JobPage from '@/components/Jobs/Job';
import { useJob } from '@/hooks/useJob'; // Import the custom hook
import { Loader2 } from 'lucide-react';
interface JobPageProps {
  params: { id: string };
}

export default function Page({ params }: JobPageProps) {
  const jobId = params.id;
  const { job, applicants, loading, error } = useJob(jobId); // Use the custom hook

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin" />
    </div>
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <div>
      {job && <JobPage job={job} applicants={applicants} />}
    </div>
  );
}