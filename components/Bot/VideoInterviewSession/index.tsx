'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TransportState, VoiceEvent, Transcript } from 'realtime-ai';
import { useVoiceClient, useVoiceClientEvent } from 'realtime-ai-react';

import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import { Job } from '@/types/merge';

interface VoiceInterviewSessionProps {
  state: TransportState;
  onLeave: () => void;
  startAudioOff?: boolean;
  job: Job;
}

export default function VoiceInterviewSession({
  state,
  onLeave,
  startAudioOff = false,
  job
}: VoiceInterviewSessionProps) {
  const voiceClient = useVoiceClient()!;
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [muted, setMuted] = useState(startAudioOff);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(!startAudioOff);
  const [transcript, setTranscript] = useState<
    { speaker: string; text: string }[]
  >([]);

  const handleBotStoppedSpeaking = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  useVoiceClientEvent(VoiceEvent.BotStoppedSpeaking, handleBotStoppedSpeaking);

  useEffect(() => {
    setHasStarted(false);
  }, []);

  useEffect(() => {
    if (hasStarted && !startAudioOff) {
      voiceClient.enableMic(true);
    }
  }, [voiceClient, startAudioOff, hasStarted]);

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
    // Implement audio toggle logic here
  };

  const handleBotTranscript = useCallback((text: string) => {
    setTranscript((prev) => [...prev, { speaker: 'AI', text: text.trim() }]);
  }, []);

  const handleUserTranscript = useCallback((data: Transcript) => {
    setTranscript((prev) => [
      ...prev,
      { speaker: 'You', text: data.text.trim() }
    ]);
  }, []);

  useVoiceClientEvent(VoiceEvent.BotTranscript, handleBotTranscript);
  useVoiceClientEvent(VoiceEvent.UserTranscript, handleUserTranscript);

  return (
    <div className="flex flex-col h-screen">
      <InterviewHeader job={job} />

      <main className="flex-grow grid grid-cols-3 gap-4 p-4">
        <div className=" h-screen col-span-1 flex justify-between flex-col gap-1">
          <div className="h-1/2">
            <AIInterviewer isReady={state === 'ready'} />
          </div>
          <div className="h-1/2">
            <TranscriptPanel transcript={transcript} />
          </div>
        </div>
        <div className="col-span-2 h-full">
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
