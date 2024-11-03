import React from 'react';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import { QuestionSetup } from './steps/QuestionSetup';
import BotSelect from './steps/BotSelect';

interface OnboardingStepsProps {
  step: number;
  onCompletion: (isComplete: boolean) => void;
}

export const InterviewConfigSteps: React.FC<OnboardingStepsProps> = ({
  step,
  onCompletion
}) => {
  switch (step) {
    case 1:
      return <StartingStep onCompletion={onCompletion} />;
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
