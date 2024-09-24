"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import InterviewConfiguration from '@/components/InterviewConfiguration';

const Page = () => {
  const searchParams = useSearchParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobParam = searchParams.get('job');
    if (jobParam) {
      setJob(JSON.parse(jobParam));
    }
  }, [searchParams]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return <InterviewConfiguration job={job} />;
};

export default Page;