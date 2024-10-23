import React from 'react';
import { CompanyInfoStep } from './steps/CompanyInfo';
import { GreenhouseIntegrationStep } from './steps/GreenhouseIntegrationStep';
import { TeamMembersStep } from './steps/TeamMemberStep';
import { CompletionStep } from './steps/CompletionStep';


export const OnboardingSteps= ({ step }: { step: number }) => {
  switch (step) {
    case 1:
      return <CompanyInfoStep/>;
    case 2:
      return <GreenhouseIntegrationStep />;
    case 3:
      return <TeamMembersStep/>;
    case 4:
      return <CompletionStep />;
    default:
      return null;
  }
};