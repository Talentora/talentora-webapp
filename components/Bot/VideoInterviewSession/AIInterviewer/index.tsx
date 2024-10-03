import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WaveForm from './waveform';

interface AIInterviewerProps {
  isReady: boolean;
}

export default function AIInterviewer({ isReady }: AIInterviewerProps) {
  return (
    <div className="relative bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg overflow-hidden">
      <div className="flex h-full flex-col items-center justify-center text-white">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder-avatar.jpg" alt="AI Recruiter" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-semibold">AI Interviewer</h2>
        <p className="mt-2 text-base">Listening...</p>
        {isReady && <WaveForm />}
      </div>
    </div>
  );
}
