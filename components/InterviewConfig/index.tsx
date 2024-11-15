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
import { InterviewConfigSteps } from './InterviewConfigSteps';
import { OnboardingNavigation } from '@/components/CompanyOnboarding/OnboardingNavigation';
import { useJob } from '@/hooks/useJob';
import { useSearchParams } from 'next/navigation';

export default function InterviewConfig({ jobId }: { jobId: string }) {
  const totalSteps = 6;
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set([6])
  ); // Initialize step 1 and 4 as completed

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const { job, loading, error } = useJob(jobId);

  // if (!job) {
  //   return <div>No job provided</div>;
  // }

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

  return (
    <div className="mx-auto py-10">
      <div className="max-w-2xl mx-auto gap-3">
        {/* <Progress value={progressValue} className="mb-3"/>  */}
        <div className="">
          <div className="mb-6">
            <h2 className="text-2xl">Welcome to Talentora</h2>
            <p className="text-lg text-gray-500">
              Let&apos;s get your <strong>{job?.name}</strong> position ready
              for AI interviews
            </p>
          </div>
          <div className="min-h-[400px]">
            <InterviewConfigSteps
              step={step}
              onCompletion={(isComplete) =>
                handleStepCompletion(step, isComplete)
              }
              job={job!}
            />
          </div>
          <div>
            <OnboardingNavigation
              step={step}
              totalSteps={totalSteps}
              prevStep={prevStep}
              nextStep={nextStep}
              isCurrentStepComplete={completedSteps.has(step)}
            />
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
