import React from 'react';
import { VoiceClientVideo } from 'realtime-ai-react';

interface CandidateVideoProps {
  isCameraOn: boolean;
}

export default function CandidateVideo({ isCameraOn }: CandidateVideoProps) {
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {isCameraOn ? (
        <VoiceClientVideo
          participant="local"
          mirror={true}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-800 text-white">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
