import { Book, Info } from "lucide-react";
import React from "react";
import { Tables } from "@/types/types_db";
import { Button } from "@/components/ui/button";

type SplashProps = {
  handleReady: () => void;
  company: Tables<'companies'>;
  job: Tables<'jobs'>;
};

export const Splash: React.FC<SplashProps> = ({ handleReady, company, job }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Welcome to your AI Interview</h1>
      <div className="space-y-4">
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
      </div>
      <Button 
        onClick={handleReady}
        className="w-full mt-6 px-4 py-3 bg-primary-dark text-white rounded-lg hover:bg-accent font-medium"
      >
        Start Interview
      </Button>
    </div>
  );
};

export default Splash;