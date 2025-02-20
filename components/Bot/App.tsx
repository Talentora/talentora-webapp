'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  RTVIClientProvider,
  RTVIClientAudio,
  useRTVIClient,
  useRTVIClientTransportState,
} from "@pipecat-ai/client-react";
import { RTVIClient, RTVIEvent, RTVIMessage, RTVIError } from "@pipecat-ai/client-js";
import { useRouter } from 'next/navigation';
import { Ear, Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Configure from './Setup';
import VideoInterviewSession from './VideoInterviewSession';
import { useUser } from '@/hooks/useUser';
import { Progress } from '@/components/ui/progress';

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
  transcript: TranscriptData[];
  application: Application | null;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
}

type TranscriptData = {
  text: string;
  role: 'bot' | 'user';
};

type TransportState = 'initialized' | 'disconnected' | 'authenticating' | 'connecting' | 'connected' | 'ready' | 'disconnecting' | 'initializing' | 'error';

const status_text: Record<TransportState, string> = {
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...',
  connected: 'Connected',
  disconnected: 'Start',
  disconnecting: 'Disconnecting...',
  initializing: 'Initializing...',
  ready: 'Ready',
  error: 'Error'
};

const transportStateToProgress: Record<TransportState, number> = {
  initialized: 100,
  disconnected: 0,
  authenticating: 50,
  connecting: 75,
  connected: 90,
  ready: 100,
  disconnecting: 0,
  initializing: 25,
  error: 0
};

const transportStateToStep: Record<TransportState, number> = {
  initialized: 1,
  disconnected: 1,
  authenticating: 2,
  connecting: 3,
  connected: 4,
  ready: 4,
  disconnecting: 1,
  initializing: 1,
  error: 0
};

export default function App({
  scout,
  jobInterviewConfig,
  companyContext,
  job,
  company,
  mergeJob,
  transcript,
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
          transcript={transcript}
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
