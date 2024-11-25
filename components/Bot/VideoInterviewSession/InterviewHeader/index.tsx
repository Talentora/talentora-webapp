import React from 'react';
import { Job as MergeJob } from '@/types/merge';
import { Tables } from '@/types/types_db';
type Company = Tables<'companies'>;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface interviewHeaderProps {
  job: MergeJob;
  company: Company;
}

export default function InterviewHeader(props: interviewHeaderProps) {
  const { job, company } = props;
  return (
    <header className="rounded-lg	border-2 bg-white p-4 shadow">
      <div className="mx-auto flex flex-col max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Candidate Assessment
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Position:</span> {job.name}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Company:</span> {company.name}
          </div>
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <span className="font-medium mr-2">Job Description:</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-primary-600 hover:text-primary-800 p-0 h-auto">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Job Description</DialogTitle>
              </DialogHeader>
              <div className="mt-4 prose prose-sm">
                {job.description || 'No description available'}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
