'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { OnboardingSteps } from './OnboardingSteps';
import { OnboardingNavigation } from './OnboardingNavigation';
import { updateCompany } from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser';

export default function OnboardingPage() {

  const totalSteps = 7;
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set([1, 3, 4, 5, 7])
  ); // Initialize step 1 and 4 as completed
  const { user, recruiter } = useUser();
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (recruiter.data && 'company_id' in recruiter.data) {
      setCompanyId(recruiter.data.company_id);
    }
  }, [recruiter.data]);


  const nextStep = async () => {
    const newStep = Math.min(step + 1, totalSteps);
    setStep(newStep);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleStepCompletion = async (
    stepNumber: number,
    isComplete: boolean
  ) => {
    setCompletedSteps((prev) => {
      const updated = new Set(prev);
      if (isComplete) {
        updated.add(stepNumber);
      } else {
        updated.delete(stepNumber);
      }
      return updated;
    });

    // If completing final step, update company
    if (stepNumber === totalSteps && isComplete && companyId) {
      try {
        await updateCompany(companyId, { configured: true });
      } catch (error) {
        console.error('Failed to update company configuration:', error);
      }
    }
  };
  

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto gap-3">
        {/* <Progress value={progressValue} className="mb-3"/>  */}
        <Card className="h-1/2 p-5 bg-background border shadow-lg overflow-auto">
          <CardHeader>
            <CardTitle>Welcome to Talentora</CardTitle>
            <CardDescription>
              Let&apos;s get your company set up in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingSteps
              step={step}
              onCompletion={(isComplete) =>
                handleStepCompletion(step, isComplete)
              }
            />
          </CardContent>
          <CardFooter>
            <OnboardingNavigation
              step={step}
              totalSteps={totalSteps}
              prevStep={prevStep}
              nextStep={nextStep}
              isCurrentStepComplete={completedSteps.has(step)}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}