'use client';

import InterviewConfig from '@/components/InterviewConfig';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import JobSettings from '@/components/JobSettings';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const jobId = params?.id as string;

  const [showConfig, setShowConfig] = useState(false);

  // if (!jobId) {
  //   return <div>No job ID found</div>;
  // }

  return (
    <div>

      <InterviewConfig jobId={jobId} />
    </div>
  );
};

export default Page;
