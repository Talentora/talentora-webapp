import React, { useState } from 'react';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Job as MergeJob } from '@/types/merge';
type SplashProps = {
  handleReady: () => void;
  company: Tables<'companies'>;
  mergeJob: MergeJob | null;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
};

export const Splash: React.FC<SplashProps> = ({
  handleReady,
  company,
  mergeJob,
  enableRecording,
  demo,
  scoutTest
}) => {
  const [showTerms, setShowTerms] = useState(true); // Start with terms shown
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <Card className="w-full bg-background max-w-md mx-auto mt-8 border border-border p-5">
      <CardHeader>
        {demo ? (
          <CardTitle>Welcome to your AI Interview</CardTitle>
        ) : (
          <CardTitle>Welcome to your Demo AI Interview</CardTitle>
        )}
      </CardHeader>
      {step === 0 ? <></> : <></>}
      <CardContent className="space-y-4">
        {enableRecording ? (
          showTerms ? (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4">
                <h2 className="font-medium mb-4">Terms and Conditions</h2>
                <p className="text-red-500 text-sm mb-2">
                  Note: This is not a legally binding terms and conditions
                  document. It is for informational purposes only.
                </p>
                <p className="text-gray-600">
                  By proceeding with this AI interview, you acknowledge and
                  agree to the following:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
                  <li>
                    Your interview will be recorded for assessment purposes
                  </li>
                  <li>
                    The AI system will process your responses to evaluate your
                    qualifications
                  </li>
                  <li>
                    Your data will be handled in accordance with our privacy
                    policy
                  </li>
                  <li>
                    The interview results will be shared with {company?.name}
                  </li>
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked as boolean)
                  }
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
          ) : (
            <div>
              <p className="text-gray-600">
                You are about to begin an AI-powered interview with{' '}
                {company?.name}. This interview is conducted by Talentora's
                advanced AI interviewer, designed to assess your qualifications
                for the {mergeJob?.name} position.
              </p>
              <p className="text-gray-600">
                The AI interviewer will ask you relevant questions about your
                experience and skills. Please speak naturally and clearly when
                responding.
              </p>
              <p className="text-gray-600 font-medium">
                Tips for a successful interview:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Ensure you're in a quiet environment</li>
                <li>Check your camera and microphone are working</li>
                <li>Speak clearly and take your time with responses</li>
              </ul>
            </div>
          )
        ) : demo && !scoutTest ? (
          <p className="text-gray-600 text-center font-medium">
            This is a demo interview. No recording will be kept and no
            assessment will be made after this demo interview.
          </p>
        ) : (
          <p className="text-gray-600 text-center font-medium">
            This is a test interview. No recording will be kept and no
            assessment will be made after this test interview.
          </p>
        )}

        {/* {step === 2 && (
            <>
              <p className="text-gray-600">
                You are about to begin an AI-powered interview with{' '}
                {company?.name}. This interview is conducted by Talentora's
                advanced AI interviewer, designed to assess your qualifications
                for the {mergeJob?.name} position.
              </p>
              <p className="text-gray-600">
                The AI interviewer will ask you relevant questions about your
                experience and skills. Please speak naturally and clearly when
                responding.
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
          )} */}
      </CardContent>
      <CardFooter className="flex justify-between gap-5">
        {enableRecording && showTerms ? (
          <Button onClick={() => setShowTerms(false)} disabled={!termsAccepted}>
            Continue to Interview
          </Button>
        ) : (
          <Button
            onClick={handleReady}
            className="w-full bg-primary-dark text-white rounded-lg hover:bg-accent font-medium"
          >
            Start Interview
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Splash;
