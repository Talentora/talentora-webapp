// components/Jobs/Job/InterviewQuestions.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { DialogHeader, DialogTitle, DialogContent, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { QuestionSetup } from '@/components/InterviewConfig/steps/QuestionSetup';
import { Separator } from '@/components/ui/separator';

interface InterviewQuestionsProps {
  loading: boolean;
  interviewConfig: Tables<'job_interview_config'> | null;
  jobId: string;
  onQuestionsUpdate?: () => void;
}

const InterviewQuestions = ({ loading, interviewConfig, jobId, onQuestionsUpdate }: InterviewQuestionsProps) => {
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);

  const interviewQuestions: { question: string; sampleResponse: string }[] = interviewConfig?.interview_questions ? 
    (typeof interviewConfig.interview_questions === 'string' ? 
      JSON.parse(interviewConfig.interview_questions) : 
      interviewConfig.interview_questions) : [];

  const handleCompletion = (isComplete: boolean) => {
    if (isComplete) {
      setShowQuestionsDialog(false);
      onQuestionsUpdate?.();
    }
  };

  const handleEditQuestions = () => {
    setShowQuestionsDialog(true);
  };

  return (
    <>
      <Card className="hover:bg-accent/50 transition-colors p-5 bg-foreground border border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Interview Questions</CardTitle>
            <MessageSquare className="h-6 w-6 text-primary" />
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
                <p className="text-sm text-muted-foreground">
                  You have <strong>{interviewQuestions.length || 0}</strong> questions configured for your <strong>{interviewConfig.type || 'standard'}</strong> interview.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {interviewQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-semibold">Question:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.question.length > 50 ? `${question.question.substring(0, 50)}...` : question.question}
                      </p>
                    </div>
                  
                  </div>
                ))}
                {interviewQuestions.length > 2 && (
                  <p className="text-sm text-muted-foreground">
                    ...
                  </p>
                )}
              </div>
              <div className="">
                <Button 
                  onClick={() => setShowQuestionsDialog(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Questions
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4" onClick={handleEditQuestions}>
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No interview questions configured.<br />
                Click to set up your questions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Interview Questions</DialogTitle>
          </DialogHeader>
          <QuestionSetup 
            jobId={jobId}
            onCompletion={()=>{}}
            existingConfig={interviewConfig}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewQuestions;