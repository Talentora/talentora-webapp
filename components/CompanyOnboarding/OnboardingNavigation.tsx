import React from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  step: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  step,
  totalSteps,
  prevStep,
  nextStep
}) => {
  return (
    <div className="flex justify-between w-full">
      {step > 0 && (
        <Button variant="outline" onClick={prevStep}>
          Previous
        </Button>
      )}
      {step < totalSteps && (
        <Button onClick={nextStep} className={step > 1 ? 'ml-4' : 'ml-auto'}>
          {step === totalSteps - 1 ? 'Finish' : 'Next'}
        </Button>
      )}
    </div>
  );
};