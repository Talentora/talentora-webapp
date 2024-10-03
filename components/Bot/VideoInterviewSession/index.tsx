'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TransportState, VoiceEvent, Transcript } from 'realtime-ai';
import { useVoiceClient, useVoiceClientEvent } from 'realtime-ai-react';

import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

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
  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);

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
    setTranscript((prev) => [...prev, { speaker: 'You', text: data.text.trim() }]);
  }, []);

  useVoiceClientEvent(VoiceEvent.BotTranscript, handleBotTranscript);
  useVoiceClientEvent(VoiceEvent.UserTranscript, handleUserTranscript);

  return (
    <div className="flex h-100vh flex-col bg-gray-100">
      <InterviewHeader job={job} />
  
      <main className="flex-grow flex p-5 space-x-5">
        <div className="w-1/2 flex flex-col space-y-5 gap-5">
          <div className="flex-grow h-1/3">
            <AIInterviewer isReady={state === 'ready'} />
          </div>
          <div className="flex-grow h-1/3">
            <TranscriptPanel transcript={transcript} />
          </div>
        </div>
        <div className="w-1/2">
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