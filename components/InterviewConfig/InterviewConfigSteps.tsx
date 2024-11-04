import React from 'react';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import { QuestionSetup } from './steps/QuestionSetup';
import BotSelect from './steps/BotSelect';
import { Job } from '@/types/merge';
import InterviewSettings from './steps/InterviewSettings';
import { HiringManagerInput } from './steps/HiringManagerInput';
interface OnboardingStepsProps {
  step: number;
  onCompletion: (isComplete: boolean) => void;
  job: Job;
}

export const InterviewConfigSteps: React.FC<OnboardingStepsProps> = ({
  step,
  onCompletion,
  job
}) => {
  switch (step) {
    case 1:
      return <StartingStep onCompletion={onCompletion} job={job} />;
    case 2:
      return <BotSelect onCompletion={onCompletion} />;
    case 3:
      return <QuestionSetup jobId={job.id} onCompletion={onCompletion} />;
    case 4:
      return <InterviewSettings jobId={job.id} onCompletion={onCompletion} />;
    case 5:
      return <HiringManagerInput jobId={job.id} onCompletion={onCompletion} />;
    case 6:
      return <CompletionStep jobId={job.id} />;
    default:
      return null;
  }
};
