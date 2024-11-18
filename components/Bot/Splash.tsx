import React from "react";
import { Tables } from "@/types/types_db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

type SplashProps = {
  handleReady: () => void;
  company: Tables<'companies'>;
  job: Tables<'jobs'>;
};

export const Splash: React.FC<SplashProps> = ({ handleReady, company, job }) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-foreground border border-border p-5">
      <CardHeader>
        <CardTitle>Welcome to your AI Interview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          You are about to begin an AI-powered interview with {company?.name}. This interview is conducted by Talentora's advanced AI interviewer, designed to assess your qualifications for the {job?.name} position.
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleReady}
          className="w-full px-4 py-3 bg-primary-dark text-white rounded-lg hover:bg-accent font-medium"
        >
          Start Interview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Splash;