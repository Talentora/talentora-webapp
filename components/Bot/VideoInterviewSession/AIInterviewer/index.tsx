import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WaveForm from './waveform';
import { useRTVIClientMediaTrack } from 'realtime-ai-react';
import { Loader2 } from 'lucide-react';

interface AIInterviewerProps {
  isReady: boolean;
}

export default function AIInterviewer({ isReady }: AIInterviewerProps) {
  const botAudioTrack = useRTVIClientMediaTrack("audio", "bot");  
  const audioStream = botAudioTrack ? new MediaStream([botAudioTrack]) : null;


  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg overflow-hidden h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-white">
        {!isReady ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Initializing...</span>
          </div>
        ) : (
          <>
            {audioStream ? (
              <WaveForm audioStream={audioStream} />
            ) : (
              <WaveForm audioStream={new MediaStream()} /> // Stationary waveform when no audio
            )}
          </>
        )}
      </div>
    </div>
  );
}
