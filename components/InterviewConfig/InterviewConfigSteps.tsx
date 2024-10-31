import React from 'react';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import { CompanyContext } from './steps/CompanyContext';
import { DepartmentContext } from './steps/DepartmentContext';
import { TeamContext } from './steps/TeamContext';

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
      return <CompanyContext onCompletion={onCompletion} />;
    case 3:
      return <DepartmentContext onCompletion={onCompletion} />;
    case 4:
      return <TeamContext onCompletion={onCompletion} />;
    case 5:
      return <CompletionStep />;
    default:
      return null;
  }
};
