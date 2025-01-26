import React from 'react';
import { Button } from '@/components/ui/button';
import ProgressDots from '@/components/ui/progress-dots';
interface OnboardingNavigationProps {
  step: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
  isCurrentStepComplete: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  step,
  totalSteps,
  prevStep,
  nextStep,
  isCurrentStepComplete
}) => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}
        {step < totalSteps && (
          <Button
            onClick={nextStep}
            className={step > 1 ? 'ml-4' : 'ml-auto'}
            disabled={!isCurrentStepComplete} // Disable if current step is not complete
          >
            {step === totalSteps - 1 ? 'Finish' : 'Next'}
          </Button>
        )}
      </div>

    </div>
  );
};
