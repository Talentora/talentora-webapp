import { Loader2, MessageSquare, MoreHorizontal } from 'lucide-react';
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
      <div className="hover:bg-accent/50 transition-colors p-5 shadow-3xl h-full rounded-lg">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-xl font-semibold">Interview Questions</h2>
            <div className="flex items-center gap-2" onClick={handleEditQuestions}>
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
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
                  You have <strong>{interviewQuestions.length || 0}</strong> questions configured for your <strong>{interviewConfig.type || 'standard'}</strong> interview.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                {interviewQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className="p-1 rounded-lg border border-border hover:bg-accent/50 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Question</span>
                        <p className="text-sm mt-1 leading-relaxed">
                          {question.question.length > 50 ? `${question.question.substring(0, 50)}...` : question.question}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {interviewQuestions.length > 2 && (
                <div onClick={handleEditQuestions} className="p-1 rounded-lg border border-border hover:bg-accent/50 transition-all opacity-70">
                  <div className="flex items-center justify-center py-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        +{interviewQuestions.length - 2} additional questions
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* <div>
                <Button onClick={handleEditQuestions}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Questions
                </Button>
              </div> */}
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
        </div>
      </div>

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Interview Questions</DialogTitle>
          </DialogHeader>
          <QuestionSetup 
            jobId={jobId}
            onCompletion={handleCompletion}
            existingConfig={interviewConfig}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewQuestions;