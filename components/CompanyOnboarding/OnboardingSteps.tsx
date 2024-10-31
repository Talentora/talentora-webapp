import React from 'react';
import { CompanyInfoStep } from './steps/CompanyInfo';
import { GreenhouseIntegrationStep } from './steps/GreenhouseIntegrationStep';
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
      // return <GreenhouseIntegrationStep onCompletion={onCompletion} />;
      return <MergeLink onCompletion={onCompletion} />;
    case 4:
      return <TeamMembersStep onCompletion={onCompletion} />;
    case 5:
      return <CompletionStep />;
    default:
      return null;
  }
};
