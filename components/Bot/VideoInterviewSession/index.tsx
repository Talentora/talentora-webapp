'use client';

import React, { useState, useEffect } from 'react';
import {
  useRTVIClient,
  useRTVIClientTransportState,
} from 'realtime-ai-react';

import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import { Job as MergeJob } from '@/types/merge';
import { Tables } from '@/types/types_db';

type Company = Tables<'companies'>;

interface VideoInterviewSessionProps {
  onLeave: () => void;
  startAudioOff?: boolean;
  job: MergeJob;
  company: Company;
  transcript: { role: 'bot' | 'user'; text: string }[];
}

export default function VideoInterviewSession({
  onLeave,
  startAudioOff = false,
  job,
  company,
  transcript,
}: VideoInterviewSessionProps) {
  const voiceClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();
  const [isMuted, setMuted] = useState(startAudioOff);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (transportState === 'error') {
      onLeave();
    }
  }, [transportState, onLeave]);

  const handleMicToggle = () => {
    voiceClient.enableMic(!isMuted);
    setMuted(!isMuted);
  };

  const handleCameraToggle = () => {
    voiceClient.enableCam(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden ">
      <div className="basis-1/6">
        <InterviewHeader job={job} company={company} />
      </div>

      <main className="flex basis-2/3 gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-1 flex-col h-full w-1/3">
          <div className="flex-1 overflow-hidden">
            <AIInterviewer isReady={transportState === 'ready'} />
          </div>
          <div className="flex">
            <TranscriptPanel transcript={transcript} />
          </div>
        </div>
        {/* Main Content */}
        <div className="w-2/3 h-full overflow-hidden">
          <CandidateVideo isCameraOn={isCameraOn} />
        </div>
      </main>

      <footer className="basis-1/6">
        <ControlPanel
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        onMicToggle={handleMicToggle}
        onCameraToggle={handleCameraToggle}
        onLeave={onLeave}
        />
      </footer>
    </div>
  );
}
