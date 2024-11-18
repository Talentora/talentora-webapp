'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TransportState, TranscriptData, RTVIEvent } from 'realtime-ai';
import {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientMediaTrack,
  useRTVIClientTransportState
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
  onLeave: () => void;
  startAudioOff?: boolean;
  job: MergeJob;
  company: Company;
  transcript: TranscriptData[];
}

export default function VoiceInterviewSession({
  onLeave,
  startAudioOff = false,
  job,
  company,
  transcript
}: VoiceInterviewSessionProps) {
  const voiceClient = useRTVIClient()!;

  const transportState = useRTVIClientTransportState();
  const [isMuted, setMuted] = useState(startAudioOff);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(!startAudioOff);
  // const [transcriptData, setTranscriptData] = useState<
    // { speaker: string; text: string }[]
  // >([]);




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

  const handleAudioToggle = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  // const audioStream = useRTVIClientMediaTrack('bot', 'audio');

  return (
    <div className="flex flex-col h-screen">
      <InterviewHeader job={job} company={company} />
      {/* <h1 className="text-black">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1>
      <h1 className="text-black">Is Mic On: {!isMuted ? 'Yes' : 'No'}</h1> */}


      <main className="flex-grow grid grid-cols-3 gap-4 p-4 h-3/4">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex-grow">
            <AIInterviewer isReady={transportState === 'ready'} />
          </div>
          <div className="h-64">
            <TranscriptPanel transcript={transcript} />
          </div>
        </div>
        <div className="col-span-2">
          <CandidateVideo isCameraOn={isCameraOn} />
        </div>
      </main>

      <ControlPanel
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        onMicToggle={handleMicToggle}
        onCameraToggle={handleCameraToggle}
        onLeave={onLeave}
      />
    </div>
  );
}
