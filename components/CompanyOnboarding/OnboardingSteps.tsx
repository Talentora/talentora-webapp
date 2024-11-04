import React from 'react';
import { CompanyInfoStep } from './steps/CompanyInfo';
import { CompanyContext } from './steps/CompanyContext';
import { CompanyContext2 } from './steps/CompanyContext2';
import { CompanyContext3 } from './steps/CompanyContext3';
import { TeamMembersStep } from './steps/TeamMemberStep';
import { CompletionStep } from './steps/CompletionStep';
import { StartingStep } from './steps/StartingStep';
import MergeLink from './steps/MergeLink';

interface OnboardingStepsProps {
  step: number;
  onCompletion: (isComplete: boolean) => void;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  step,
  onCompletion
}) => {
  switch (step) {
    case 1:
      return <StartingStep onCompletion={onCompletion} />;
    case 2:
      return <CompanyInfoStep onCompletion={onCompletion} />;
    case 3:
      return <CompanyContext onCompletion={onCompletion} />;  
    case 4:
      return <CompanyContext2 onCompletion={onCompletion} />;
    case 5:
      return <CompanyContext3 onCompletion={onCompletion} />;
    case 6:
      return <MergeLink onCompletion={onCompletion} />;
    case 7:
      return <TeamMembersStep onCompletion={onCompletion} />;
    case 8:
      return <CompletionStep />;
    default:
      return null;
  }
};
