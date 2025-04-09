import React from 'react';
import { BarVisualizer, useVoiceAssistant } from '@livekit/components-react';

export default function AudioVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="h-32 border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Audio Level</h3>
      <BarVisualizer 
        state={state} 
        trackRef={audioTrack}
        barCount={10}
      />
    </div>
  );
} 