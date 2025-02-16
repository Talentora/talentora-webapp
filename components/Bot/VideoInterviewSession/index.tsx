'use client';

import React, { useState, useEffect } from 'react';
import { useRTVIClient, useRTVIClientTransportState } from 'realtime-ai-react';
import { usePermissions } from '@daily-co/daily-react';

import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import { Job as MergeJob } from '@/types/merge';
import { Tables } from '@/types/types_db';
import { RTVIClient } from 'realtime-ai';

type Company = Tables<'companies'>;

interface VideoInterviewSessionProps {
  onLeave: () => void;
  startAudioOff?: boolean;
  job: MergeJob | null;
  company: Company;
  transcript: { role: 'bot' | 'user'; text: string }[];
  demo: boolean;
}

export default function VideoInterviewSession({
  onLeave,
  startAudioOff = false,
  job,
  company,
  transcript,
  demo
}: VideoInterviewSessionProps) {
  const voiceClient: RTVIClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();
  const [isMuted, setMuted] = useState(startAudioOff);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Initialize devices when component mounts
  useEffect(() => {
    if (transportState === 'connected') {
      // Set initial states based on startAudioOff prop
      voiceClient.enableMic(!startAudioOff);
      voiceClient.enableCam(true);
      setMuted(startAudioOff);
      setIsCameraOn(true);
    }
  }, [transportState, startAudioOff, voiceClient]);

  useEffect(() => {
    if (transportState === 'error') {
      onLeave();
    }
  }, [transportState, onLeave]);

  const handleMicToggle = () => {
    const newMutedState = !isMuted;
    voiceClient.enableMic(!newMutedState);
    setMuted(newMutedState);
  };

  const handleCameraToggle = () => {
    const newCameraState = !isCameraOn;
    voiceClient.enableCam(newCameraState);
    setIsCameraOn(newCameraState);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="basis-1/6">
        <InterviewHeader job={job} company={company} demo={demo} />
      </div>

      <main className="flex basis-1/3 gap-4 p-4 m-5">
        {/* Sidebar */}
        <div className="flex flex-col h-full w-1/3 gap-5">
          <div className="flex-1 ">
            <AIInterviewer isReady={transportState === 'ready'} />
          </div>
          <div className="flex basis-1/2 w-full overflow-y-auto">
            <TranscriptPanel transcript={transcript} />
          </div>
        </div>
        {/* Main Content */}
        <div className="w-2/3 h-full">
          <CandidateVideo isCameraOn={isCameraOn && voiceClient.isCamEnabled} />
        </div>
      </main>

      <footer className="basis-1/6">
        <ControlPanel
          // isMuted={isMuted || !voiceClient.isMicEnabled}
          isMuted={isMuted}
          isCameraOn={isCameraOn}
          // isCameraOn={isCameraOn && voiceClient.isCamEnabled}
          onMicToggle={handleMicToggle}
          onCameraToggle={handleCameraToggle}
          onLeave={onLeave}
        />
      </footer>
    </div>
  );
}
