import React from 'react';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import { CompanyContext } from './steps/CompanyContext';
import { DepartmentContext } from './steps/DepartmentContext';
import { TeamContext } from './steps/TeamContext';
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
      return <CompletionStep />;
    default:
      return null;
  }
};
