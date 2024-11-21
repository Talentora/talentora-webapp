// components/Jobs/Job/InterviewSettings.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { Tables } from '@/types/types_db';

type InterviewConfig = Tables<'job_interview_config'>;

interface InterviewSettingsProps {
  loading: boolean;
  interviewConfig: InterviewConfig | null;
  setShowSetupDialog: (show: boolean) => void;
  jobId: string;
}

const InterviewSettings = ({ loading, interviewConfig, setShowSetupDialog, jobId }: InterviewSettingsProps) => {
  return (
    <Link href={`/jobs/${jobId}/settings`} className="flex-1">
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-5 bg-foreground border border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Interview Settings</CardTitle>
            <Settings className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : interviewConfig ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{interviewConfig.interview_name || 'Unnamed Interview'}</h3>
                <p className="text-sm text-muted-foreground">Type: {interviewConfig.type || 'Not set'}</p>
                <p className="text-sm text-muted-foreground">Duration: {interviewConfig.duration || 'Not set'}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <Settings className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No interview settings configured.<br />
                Click to set up your interview.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default InterviewSettings;