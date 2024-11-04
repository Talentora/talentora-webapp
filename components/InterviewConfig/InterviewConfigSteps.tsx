import React from 'react';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import { QuestionSetup } from './steps/QuestionSetup';
import BotSelect from './steps/BotSelect';
import { Job } from '@/types/merge';
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
      return <QuestionSetup />;
    case 4:
      return <CompletionStep />;
    default:
      return null;
  }
};
