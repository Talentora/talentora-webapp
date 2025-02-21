'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  useRTVIClient,
  useRTVIClientTransportState,
} from "@pipecat-ai/client-react";
import { RTVIEvent, RTVIMessage, RTVIError } from "@pipecat-ai/client-js";
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Configure from './Setup';
import VideoInterviewSession from './VideoInterviewSession';
import { useUser } from '@/hooks/useUser';
import { BotLLMTextData } from '@pipecat-ai/client-js';
import { TranscriptData } from '@pipecat-ai/client-js';
import { InterviewTranscript } from '@/types/transcript';
type ScoutConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type Application = Tables<'applications'>;

interface ScoutProps {
  scout: ScoutConfig;
  jobInterviewConfig: JobInterviewConfig | null;
  companyContext: CompanyContext;
  job: Job | null;
  company: Company;
  mergeJob: MergeJob | null;
  transcript: InterviewTranscript;
  application: Application | null;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
}


export default function App({
  scout,
  jobInterviewConfig,
  companyContext,
  job,
  company,
  mergeJob,
  transcript: initialTranscript,
  application,
  enableRecording,
  demo,
  scoutTest
}: ScoutProps) {
  const { user } = useUser();
  const role = user?.data?.user_metadata?.role;
  const router = useRouter();

  const voiceClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();
  const [appState, setAppState] = useState<'idle' | 'ready' | 'connecting' | 'connected'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const mountedRef = useRef(false);
  const initializingRef = useRef(false);

  // Handle errors from the voice client
  useEffect(() => {
    if (!voiceClient) return;

    const handleError = (message: RTVIMessage) => {
      console.error('Voice client error:', message);
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    };

    voiceClient.on(RTVIEvent.Error, handleError);
    return () => {
      voiceClient.off(RTVIEvent.Error, handleError);
    };
  }, [voiceClient]);

  // Initialize devices when component mounts
  useEffect(() => {
    if (!voiceClient || initializingRef.current) return;
    
    initializingRef.current = true;
    const initializeDevices = async () => {
      try {
        await voiceClient.initDevices?.();
        mountedRef.current = true;
      } catch (err) {
        console.error('Error initializing devices:', err);
        initializingRef.current = false;
      }
    };

    initializeDevices();

    return () => {
      mountedRef.current = false;
      initializingRef.current = false;
    };
  }, [voiceClient]);

  // Update app state based on transport state
  useEffect(() => {
    console.log('Transport state:', transportState);
    switch (transportState) {
      case 'initialized':
      case 'disconnected':
        setAppState('ready');
        break;
      case 'authenticating':
      case 'connecting':
        setAppState('connecting');
        break;
      case 'connected':
      case 'ready':
        setAppState('connected');
        break;
      case 'disconnecting':
        // Handle disconnecting state
        break;
      default:
        setAppState('idle');
    }
  }, [transportState]);

  // Handle transcript updates from the voice client
  useEffect(() => {
    if (!voiceClient) return;

    const handleTranscript = (data: BotLLMTextData) => {
      // Transcript handling is now done in the Bot component
      console.log('[TRANSCRIPT] Bot transcript received:', data);
    };

    voiceClient.on(RTVIEvent.BotTranscript, handleTranscript);
    return () => {
      voiceClient.off(RTVIEvent.BotTranscript, handleTranscript);
    };
  }, [voiceClient]);

  const start = useCallback(async () => {
    if (!voiceClient || !mountedRef.current) return;

    try {
      // Disable the mic until the bot has joined
      voiceClient.enableMic(false);
      await voiceClient.connect();
    } catch (e) {
      const error = e as RTVIError;
      setError(error.message || 'Unknown error occurred');
      voiceClient.disconnect();
    }
  }, [voiceClient]);

  const leave = useCallback(async () => {
    if (!voiceClient) return;
    
    try {
      await voiceClient.disconnect();
      if (demo) {
        if (role === 'applicant') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else if (scoutTest) {
        router.push('/jobs');
      } else {
        router.push('/assessment/conclusion');
      }
    } catch (err) {
      console.error('Error during disconnect:', err);
    }
  }, [voiceClient, demo, role, router, scoutTest]);

  // Error: show full screen message
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  // Connected: show session view
  if (appState === 'connected') {
    return (
      <div>
        <VideoInterviewSession
          onLeave={leave}
          job={mergeJob}
          company={company}
          startAudioOff={startAudioOff}
          transcript={initialTranscript}
          demo={demo}
        />
      </div>
    );
  }

  // Default: show setup view
  const isReady = appState === 'ready' && mountedRef.current;

  return (
    <Card className="animate-appear max-w-lg mx-auto mt-8 bg-background p-5">
      <CardHeader className="space-y-4">
        <CardTitle>Demo AI Interview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Configure onStartInterview={start} />
      </CardContent>
    </Card>
  );
}
