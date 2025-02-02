// components/Jobs/Job/InterviewSettings.tsx
import { Loader2, Settings, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Tables } from '@/types/types_db';
import { DialogHeader, DialogTitle, DialogContent, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { InterviewSettings as InterviewSettingsForm } from '@/components/InterviewConfig/steps/InterviewSettings';
import { QuestionSetup } from '@/components/InterviewConfig/steps/QuestionSetup';
import { Separator } from '@/components/ui/separator';

interface InterviewSettingsProps {
  loading: boolean;
  interviewConfig: Tables<'job_interview_config'> | null;
  setShowSetupDialog: (show: boolean) => void;
  jobId: string;
}

const InterviewSettings = ({ loading, interviewConfig, setShowSetupDialog, jobId }: InterviewSettingsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditQuestions = () => {
    setShowQuestionsDialog(true);
  };

  const handleCompletion = (isComplete: boolean) => {
    if (isComplete) {
      setShowEditDialog(false);
    }
  };

  return (
    <>
      <div className="hover:bg-accent/50 transition-colors cursor-pointer p-5 shadow-3xl h-full">
        {/* <Link href={`/jobs/${jobId}/settings`} className="flex-1"> */}
          <div >
            <div className="flex items-center justify-between gap-5">
              <h2 className="text-xl font-semibold">Interview Settings</h2>
              <div className="flex items-center gap-2" onClick={handleEdit}>
                <Settings className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        {/* </Link> */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : interviewConfig ? (
            <div className="space-y-6">
              <div className="pt-3 rounded-lg  hover:bg-accent/50 transition-all">
                <h4 className="text-base font-medium mb-2">{interviewConfig.interview_name || 'Unnamed Interview'}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Type:</span> {interviewConfig.type || 'Not set'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Duration:</span> {interviewConfig.duration || 'Not set'} minutes
                    </p>
                  </div>
                </div>
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
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {interviewConfig ? 'Edit Interview Settings' : 'Interview Settings'}
            </DialogTitle>
          </DialogHeader>
          <InterviewSettingsForm 
            jobId={jobId} 
            onCompletion={handleCompletion}
            existingConfig={interviewConfig} 
          />
        </DialogContent>
        
      </Dialog>

     
    </>
  );
};

export default InterviewSettings;