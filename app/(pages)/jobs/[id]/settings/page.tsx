'use client';

import InterviewConfig from '@/components/InterviewConfig';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import JobSettings from '@/components/JobSettings';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const jobId = params?.id as string;
  console.log('jobId from params:', jobId);
  
  const [showConfig, setShowConfig] = useState(false);

  // if (!jobId) {
  //   return <div>No job ID found</div>;
  // }

  return (
    <div>
      {/* <JobSettings onConfigureInterview={() => setShowConfig(true)} />

      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="w-[1200px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <InterviewConfig />
        </DialogContent>
      </Dialog> */}
      <InterviewConfig jobId={jobId} />
    </div>
  );
};

export default Page;
