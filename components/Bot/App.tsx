'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRTVIClient, useRTVIClientTransportState, useRTVIClientEvent } from 'realtime-ai-react';
import { useRecording } from '@daily-co/daily-react';
import VideoInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import { LLMHelper, RTVIError, RTVIEvent, RTVIMessage } from 'realtime-ai';
// import { Configure } from './Setup/Configure';
import Configure from './Setup';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Ear, Loader2 } from 'lucide-react';

type BotConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type Application = Tables<'applications'>;
interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  transcript: TranscriptData[];
  application: Application;
  // transcript: { speaker: string; text: string }[];
}

type TranscriptData = {
  // speaker: string;
  text: string;
  role: 'bot' | 'user';
}


// import { TranscriptData } from 'realtime-ai';
import { createAISummary } from '@/utils/supabase/queries';
import { useRouter } from 'next/navigation';
const status_text = {
  idle: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
};

export default function App({ bot, jobInterviewConfig, companyContext, job, company, mergeJob, transcript,application }: BotProps) {
  const voiceClient = useRTVIClient()!;
  const { startRecording, stopRecording } = useRecording({
    onRecordingStarted: (ev) => {
      const recordingId = ev.recordingId;
      console.log("Recording started with ID:", recordingId);

      if (!recordingId) return;
      createAISummary(applicationId, recordingId);
    },
    onRecordingError: (ev) => {
      console.error("Recording error:", ev);
    },
    onRecordingData: (ev) => {
      console.log("Recording data:", ev);
    }
  });
  const transportState = useRTVIClientTransportState();
  
  const [appState, setAppState] = useState<'idle' | 'ready' | 'connecting' | 'connected'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const mountedRef = useRef<boolean>(false);
  const applicationId = application.id;

  const router = useRouter();



  voiceClient.on(RTVIEvent.Error, (message: string) => {
    console.log("Error", message);
    setError(message);
  });

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || mountedRef.current) return;
    mountedRef.current = true;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  useEffect(() => {
    switch (transportState) {
      case "initialized":
        setAppState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);




  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
        await voiceClient.connect();
        await voiceClient.enableCam(true);
        await voiceClient.enableMic(true);
        
        // Update the useRecording hook to capture the recording ID
        const recording = startRecording();
        console.log("Recording", recording);
    } catch (e) {
        setError((e as Error).message || "Unknown error occurred");
        voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
    const recording = stopRecording();
    console.log("Stopped Recording", recording);
    router.push('/assessment/conclusion');

  }

  // Error: show full screen message
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  if (appState === 'connected') {
    return (
      <VideoInterviewSession
        onLeave={leave}
        job={mergeJob}
        company={company}
        startAudioOff={startAudioOff}
        transcript={transcript}
      />
    );
  }

  const isReady = appState === 'ready';

  console.log("Voice Client", voiceClient);

  return (
    <Card className="animate-appear max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
          <Ear className="size-7 md:size-5 text-primary-400" />
          Works best in a quiet environment with a good internet connection.
        </div>
        <Configure onStartInterview={start} />
      </CardContent>
    </Card>
  );
}