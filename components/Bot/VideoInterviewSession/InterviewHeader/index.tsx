import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Job } from '@/types/greenhouse';

interface interviewHeaderProps {
  job: Job;
}

export default function InterviewHeader(props: interviewHeaderProps) {
  const { job } = props;
  return (
    <header className="rounded-lg	border-2 bg-white p-4 shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI Candidate Assessment</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Position:</span> {job.name}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Company:</span> {job.id}
          </div>
        </div>
      </div>
    </header>
  );
}
