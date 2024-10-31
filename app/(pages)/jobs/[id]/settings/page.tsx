'use client';

import InterviewConfig from '@/components/InterviewConfig';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import JobSettings from '@/components/JobSettings';
import { useState } from 'react';

const Page = () => {
  const [showConfig, setShowConfig] = useState(false);
  return (
    <div>
      <JobSettings onConfigureInterview={() => setShowConfig(true)} />

      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="w-[1200px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <InterviewConfig />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
