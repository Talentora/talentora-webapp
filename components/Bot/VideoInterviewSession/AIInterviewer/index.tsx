import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WaveForm from './waveform';

interface AIInterviewerProps {
  isReady: boolean;
}

export default function AIInterviewer({ isReady }: AIInterviewerProps) {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg overflow-hidden h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-white">
        {/* <h2 className="text-xl font-semibold">AI Interviewer</h2>
        <p className="mt-2 text-base">Listening...</p> */}
        <WaveForm />
      </div>
    </div>
  );
}
