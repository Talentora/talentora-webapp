import React, { useState } from "react";
import { Tables } from "@/types/types_db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Job as MergeJob } from "@/types/merge";

type SplashProps = {
  handleReady: () => void;
  company: Tables<'companies'>;
  mergeJob: MergeJob;
};

export const Splash: React.FC<SplashProps> = ({ handleReady, company, mergeJob }) => {
  // step: 0 = initial; 1 = review terms; 2 = interview instructions
  const [step, setStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <Card className="w-full bg-background max-w-md mx-auto mt-8 border border-border p-5">
      <CardHeader>
        <CardTitle>Welcome to your AI Interview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <p className="text-gray-600">
            Click "Review Terms" to read our terms and conditions before starting.
          </p>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto border rounded-lg p-4">
              <h2 className="font-medium mb-4">Terms and Conditions</h2>
              <p className="text-red-500 text-sm mb-2">
                Note: This is not a legally binding document. It is for informational purposes only.
              </p>
              <p className="text-gray-600">
                By proceeding with this AI interview, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
                <li>Your interview will be recorded for assessment purposes</li>
                <li>The AI system will process your responses to evaluate your qualifications</li>
                <li>Your data will be handled in accordance with our privacy policy</li>
                <li>The interview results will be shared with {company?.name}</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="border-2 border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-gray-600 cursor-pointer"
              >
                I have read and agree to the terms and conditions
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600">
              You are about to begin an AI-powered interview with {company?.name}. This interview is conducted by Talentora's advanced AI interviewer, designed to assess your qualifications for the {mergeJob?.name} position.
            </p>
            <p className="text-gray-600">
              The AI interviewer will ask you relevant questions about your experience and skills. Please speak naturally and clearly when responding.
            </p>
            <p className="text-gray-600 font-medium">
              Tips for a successful interview:
            </p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Ensure you're in a quiet environment</li>
              <li>Check your camera and microphone are working</li>
              <li>Speak clearly and take your time with responses</li>
            </ul>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {step === 0 && (
          <Button onClick={() => setStep(1)}>
            Review Terms
          </Button>
        )}
        {step === 1 && (
          <Button 
            onClick={() => setStep(2)}
            disabled={!termsAccepted}
          >
            Continue to Interview
          </Button>
        )}
        {step === 2 && (
          <Button 
            onClick={handleReady}
            disabled={!termsAccepted}
            className="w-full rounded-lg font-medium"
          >
            Start Interview
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Splash;
