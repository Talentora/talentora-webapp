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
  
  const questionCount = interviewConfig?.interview_questions ? 
    (typeof interviewConfig.interview_questions === 'string' ? 
      interviewQuestions.length : 
      interviewQuestions.length) : 0;

  const questions = interviewConfig?.interview_questions ? 
    (typeof interviewConfig.interview_questions === 'string' ? 
      JSON.parse(interviewConfig.interview_questions) : 
      interviewConfig.interview_questions) : [];

  const handleCompletion = (isComplete: boolean) => {
    if (isComplete) {
      setShowQuestionsDialog(false);
      onQuestionsUpdate?.();
    }
  };

  return (
    <>
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-5 bg-white dark:bg-transparent shadow-[0_4px_6px_-1px_rgba(90,79,207,0.3),0_2px_4px_-2px_rgba(90,79,207,0.2)] bg-card hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform cursor-pointer border border-border shadow-3xl h-full">
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
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  You have <strong>{questionCount}</strong> questions configured for your <strong>{interviewConfig?.type || 'standard'}</strong> interview.
                </p>
              </div>
              <Separator />
              {questions.length > 0 && (
                <div className="space-y-2">
                  {questions.slice(0, 2).map((question: any, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {index + 1}. {question.question}
                    </div>
                  ))}
                  {questions.length > 2 && (
                    <p className="text-sm text-muted-foreground italic">
                      and {questions.length - 2} more questions...
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowQuestionsDialog(true)}
                  className="opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Questions
                </Button>
              </div>
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
            onCompletion={handleCompletion}
            existingConfig={interviewConfig}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewQuestions; 