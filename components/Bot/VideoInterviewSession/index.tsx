'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  LogOut
} from 'lucide-react';
import { Transcript, TransportState, VoiceEvent } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientEvent,
  VoiceClientVideo
} from 'realtime-ai-react';

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
  const [transcript, setTranscript] = useState<
    { speaker: string; text: string }[]
  >([]);

  useVoiceClientEvent(
    VoiceEvent.BotStoppedSpeaking,
    useCallback(() => {
      if (hasStarted) return;
      setHasStarted(true);
    }, [hasStarted])
  );

  useEffect(() => {
    setHasStarted(false);
  }, []);

  useEffect(() => {
    if (!hasStarted || startAudioOff) return;
    voiceClient.enableMic(true);
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

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((text: string) => {
      setTranscript((prev) => [...prev, { speaker: 'AI', text: text.trim() }]);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.UserTranscript,
    useCallback((data: Transcript) => {
      setTranscript((prev) => [
        ...prev,
        { speaker: 'You', text: data.text.trim() }
      ]);
    }, [])
  );

  return (
    <div className="flex h-100vh flex-col bg-gray-100 gap-5 justify-between">
      <InterviewHeader job={job} />

      <main>
        <div className="flex flex-row gap-5">
          <div className="w-1/2 flex flex-col gap-5">
            <div className="h-1/2">
              <AIInterviewer isReady={state === 'ready'} />
            </div>
            <div className="h-1/2">
              <TranscriptPanel transcript={transcript} />
            </div>
          </div>
          <div className="w-1/2">
            <CandidateVideo isCameraOn={isCameraOn} />
          </div>
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
