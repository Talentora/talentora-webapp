'use client';

import { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import ProgressDots from '@/components/ui/progress-dots';
export default function OnboardingPage() {
  const totalSteps = 8;
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set([1, 3,4,5,7,8])
  ); // Initialize step 1 and 4 as completed

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleStepCompletion = (stepNumber: number, isComplete: boolean) => {
    setCompletedSteps((prev) => {
      const updated = new Set(prev);
      if (isComplete) {
        updated.add(stepNumber);
      } else {
        updated.delete(stepNumber);
      }
      return updated;
    });
  };

  useEffect(() => {
    // Optionally, you can add logic here to persist completedSteps to localStorage or a backend
  }, [completedSteps]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto gap-3">
        {/* <Progress value={progressValue} className="mb-3"/>  */}
        <Card className="bg-foreground p-5 border border-gray-200 shadow-lg overflow-auto">
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
