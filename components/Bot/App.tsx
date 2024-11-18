'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRTVIClient, useRTVIClientTransportState, useRTVIClientEvent } from 'realtime-ai-react';
import { useRecording } from '@daily-co/daily-react';
import VoiceInterviewSession from '@/components/Bot/VideoInterviewSession';
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

interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  transcript: TranscriptData[];
  // transcript: { speaker: string; text: string }[];
}
import { TranscriptData } from 'realtime-ai';
const status_text = {
  idle: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
};

export default function App({ bot, jobInterviewConfig, companyContext, job, company, mergeJob, transcript }: BotProps) {
  const voiceClient = useRTVIClient()!;
  const { startRecording, stopRecording } = useRecording();
  const transportState = useRTVIClientTransportState();
  
  const [appState, setAppState] = useState<'idle' | 'ready' | 'connecting' | 'connected'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const mountedRef = useRef<boolean>(false);


  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback((message: RTVIMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

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


function promptBot() {
  const llmHelper = voiceClient.getHelper("llm") as LLMHelper;
  console.log("Prompting Bot");
  llmHelper.setContext({
    messages: [{
      role: "system",
      content: `You are an AI interviewer conducting an interview for the ${job?.name || ''} position at ${company?.name || ''}.
      
      Company Context:
      ${companyContext?.description || 'No company context provided'}

      Job Requirements:
      ${jobInterviewConfig?.requirements || 'No specific requirements provided'}

      Interview Instructions:
      ${jobInterviewConfig?.instructions || 'Assess the candidate\'s qualifications and experience professionally.'}

      Keep responses clear and concise. Avoid special characters except '!' or '?'.`
    }]
  });
}

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      await voiceClient.connect();
      promptBot();
      startRecording();
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occurred");
      voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
    stopRecording();
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
      <VoiceInterviewSession
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