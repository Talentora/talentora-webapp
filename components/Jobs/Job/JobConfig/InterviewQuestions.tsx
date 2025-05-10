'use client'

import { Loader2, MessageSquare } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InterviewQuestionsProps {
  loading: boolean;
  interviewConfig: Tables<'job_interview_config'> | null;
  jobId: string;
  onQuestionsUpdate?: () => void;
}

const InterviewQuestions = ({ loading, interviewConfig, jobId }: InterviewQuestionsProps) => {
  return (
    <div className="hover:bg-accent/50 transition-colors p-5 shadow-3xl h-full rounded-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-5">
          <h2 className="text-xl font-semibold">Interview Flow</h2>
          <Link href={`/jobs/${jobId}/prompt`}>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : interviewConfig ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Configure your interview flow using the visual flow builder.
              </p>
            </div>
            <Link href={`/jobs/${jobId}/prompt`}>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Flow Builder
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No interview flow configured.<br />
              Click to set up your flow.
            </p>
            <Link href={`/jobs/${jobId}/prompt`}>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Set Up Flow
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;