'use client';

import React, { useEffect } from 'react';
import { useRTVIClient, useRTVIClientTransportState, useRTVIClientMediaDevices } from "@pipecat-ai/client-react";
import { usePermissions } from '@daily-co/daily-react';
import DailyIframe from '@daily-co/daily-js';
import InterviewHeader from './InterviewHeader';
import AIInterviewer from './AIInterviewer';
import CandidateVideo from './CandidateVideo';
import TranscriptPanel from './TranscriptPanel';
import ControlPanel from './ControlPanel';
import MediaDevicePopup from './MediaDevicePopup';
import { Job as MergeJob } from '@/types/merge';
import { Tables } from '@/types/types_db';

type Company = Tables<'companies'>;

interface VideoInterviewSessionProps {
  onLeave: () => void;
  startAudioOff?: boolean;
  job: MergeJob | null;
  company: Company;
  transcript: {
    text: string;
    final: boolean;
    timestamp: string;
    user_id: string;
    role: 'bot' | 'user';
  }[];
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
  const client = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();
  const { availableMics, availableCams, selectedMic, selectedCam, updateMic, updateCam } = useRTVIClientMediaDevices();

  function startRecording() {
    const callInstance = DailyIframe.getCallInstance();
    console.log('[RECORDING] Call instance:', callInstance);
    if (callInstance) {
      callInstance.startRecording();
    }
  }
  
  // Initialize devices when they become available
  useEffect(() => {
    if (transportState === 'connected') {
      // Set default devices if none selected
      if (availableMics.length > 0 && !selectedMic) {
        console.log('[DEVICES] Setting default mic:', availableMics[0].label);
        updateMic(availableMics[0].deviceId);
      }
      if (availableCams.length > 0 && !selectedCam) {
        console.log('[DEVICES] Setting default camera:', availableCams[0].label);
        updateCam(availableCams[0].deviceId);
      }
      startRecording();

      // Enable/disable devices based on props
      client.enableMic(!startAudioOff);
      client.enableCam(true);
    }
  }, [transportState, availableMics, availableCams, selectedMic, selectedCam, updateMic, updateCam, client, startAudioOff]);

  useEffect(() => {
    if (transportState === 'error') {
      onLeave();
    }
  }, [transportState, onLeave]);

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
            <TranscriptPanel transcripts={transcript} />
          </div>
        </div>
        {/* Main Content */}
        <div className="w-2/3 h-full">
          <CandidateVideo />
        </div>
      </main>

      <footer className="basis-1/6">
        <ControlPanel onLeave={onLeave} />
      </footer>

      {/* Media Device Settings Popup */}
      <MediaDevicePopup />
    </div>
  );
}
