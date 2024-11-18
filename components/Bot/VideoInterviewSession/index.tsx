'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TransportState, TranscriptData, RTVIEvent } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState
} from 'realtime-ai-react';

import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import { Job as MergeJob } from '@/types/merge';
import { Tables } from '@/types/types_db';
type Company = Tables<'companies'>;

interface VoiceInterviewSessionProps {
  state: TransportState;
  onLeave: () => void;
  startAudioOff?: boolean;
  job: MergeJob;
  company: Company;
}

export default function VoiceInterviewSession({
  state,
  onLeave,
  startAudioOff = false,
  job,
  company
}: VoiceInterviewSessionProps) {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();
  const [muted, setMuted] = useState(startAudioOff);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(!startAudioOff);
  const [transcriptData, setTranscriptData] = useState<
    { speaker: string; text: string }[]
  >([]);

  const VoiceClient = useVoiceClient()!;

  VoiceClient.on(RTVIEvent.BotStoppedSpeaking, () => {
    console.log("[EVENT] Bot stopped speaking");
  });

  VoiceClient.on(RTVIEvent.BotTranscript, (text: string) => {
    setTranscriptData((prev) => [...prev, { speaker: 'AI', text: text.trim() }]);
  });

  VoiceClient.on(RTVIEvent.UserTranscript, (data: TranscriptData) => {
    setTranscriptData((prev) => [
      ...prev,
      { speaker: 'You', text: data.text.trim() }
    ]);
  });




  useEffect(() => {
    if (state === 'error') {
      onLeave();
    }
  }, [state, onLeave]);


  const handleMicToggle = () => {
    voiceClient.enableMic(!muted);
    setMuted(!muted);
  };

  const handleCameraToggle = () => {
    voiceClient.enableCam(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  };

  const handleAudioToggle = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <div className="flex flex-col h-screen">
      <InterviewHeader job={job} company={company} />

      <main className="flex-grow grid grid-cols-3 gap-4 p-4 h-3/4">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex-grow">
            <AIInterviewer isReady={transportState === 'ready'} />
          </div>
          <div className="h-64">
            <TranscriptPanel transcript={transcriptData} />
          </div>
        </div>
        <div className="col-span-2">
          <CandidateVideo isCameraOn={isCameraOn} />
        </div>
      </main>

      <ControlPanel
        isMuted={muted}
        isCameraOn={isCameraOn}
        isAudioEnabled={isAudioEnabled}
        onMicToggle={handleMicToggle}
        onCameraToggle={handleCameraToggle}
        onAudioToggle={handleAudioToggle}
        onLeave={onLeave}
      />
    </div>
  );
}
