'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingSteps } from './OnboardingSteps';
import { OnboardingNavigation } from './OnboardingNavigation';

export default function OnboardingPage() {
  const totalSteps = 4;
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Talentora</CardTitle>
          <CardDescription>Let&apos;s get your company set up in just a few steps</CardDescription>
          {step === 0 && (
            <ul className="list-disc list-inside mt-4 space-y-1">
              <li>Enter your company info</li>
              <li>Setup Greenhouse integration using your API key</li>
              <li>Invite your team to this Talentora workspace</li>
              <li>Get Started!</li>
            </ul>
          )}
        </CardHeader>
        <CardContent>
          <OnboardingSteps step={step} />
        </CardContent>
        <CardFooter>
          <OnboardingNavigation step={step} totalSteps={totalSteps} prevStep={prevStep} nextStep={nextStep} />
        </CardFooter>
      </Card>
    </div>
  );
}
