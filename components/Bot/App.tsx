'use client';

import { useEffect, useState } from 'react';
import { Ear, Loader2 } from 'lucide-react';
import {
  useVoiceClient,
  useVoiceClientTransportState
} from 'realtime-ai-react';

import { useRecording } from '@daily-co/daily-react';
import VoiceInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Configure } from './Setup';

const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  handshaking: 'Requesting agent...',
  connecting: 'Connecting...'
};

import { Tables } from '@/types/types_db';
type BotConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
import { Job as MergeJob } from '@/types/merge';
import { TransportState } from 'realtime-ai';

interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
}

export default function App({ bot, jobInterviewConfig, companyContext, job, company, mergeJob }: BotProps) {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();
  const { startRecording, stopRecording } = useRecording();

  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const [devicesInitialized, setDevicesInitialized] = useState(false);

  useEffect(() => {
    if (!voiceClient) return;
    
    async function initializeDevices() {
      try {
        await voiceClient.initDevices();
        setDevicesInitialized(true);
      } catch (err) {
        setError('Failed to initialize audio/video devices. Please check permissions.');
      }
    }

    if (!devicesInitialized) {
      initializeDevices();
    }
  }, [voiceClient, devicesInitialized]);

  useEffect(() => {
    switch (transportState) {
      case 'initialized':
        setAppState('ready');
        break;
      case 'connecting':
        setAppState('connecting');
        break;
      case 'ready':
        setAppState('connected');
        break;
      case 'disconnected':
        setAppState('idle');
        setDevicesInitialized(false);
        break;
      default:
        setAppState('idle');
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient || !devicesInitialized) return;

    setError(null);

    const connectionTimeout = setTimeout(() => {
      if (voiceClient.state !== 'ready') {
        setError('Bot failed to join or enter ready state. Server may be busy. Please try again later.');
        voiceClient.disconnect();
      }
    }, 15000);

    try {
      await voiceClient.enableMic(!startAudioOff);
      await voiceClient.enableCam(true);
      
      startRecording();
      await voiceClient.start();
      
      clearTimeout(connectionTimeout);
    } catch (e) {
      clearTimeout(connectionTimeout);
      setError('Unable to authenticate. Server may be offline or busy. Please try again later.');
      await voiceClient.disconnect();
    }
  }

  async function leave() {
    try {
      stopRecording();
      await voiceClient.disconnect();
      window.location.reload();
    } catch (error) {
      console.error('Error during leave:', error);
    }
  }

  if (error) {
    return (
      <Alert className="bg-destructive text-destructive-foreground">
        <p>{error}</p>
      </Alert>
    );
  }

  if (appState === 'connected') {
    return (
      <VoiceInterviewSession
        state={transportState as TransportState}
        onLeave={leave}
        startAudioOff={startAudioOff}
        job={mergeJob}
        company={company}
      />
    );
  }

  const isReady = appState === 'ready';

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card.Card shadow>
        <h1>{transportState}</h1>
        <h1>{appState}</h1>
        <Card.CardHeader>
          <Card.CardTitle>Configuration</Card.CardTitle>
          <Card.CardDescription>
            Please configure your devices and pipeline settings below
          </Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent stack>
          <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm rounded-md font-medium text-pretty">
            <Ear className="size-7 md:size-5 text-primary-400" />
            Works best in a quiet environment with a good internet.
          </div>
          <Configure
            startAudioOff={startAudioOff}
            handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
            state={appState}
          />
        </Card.CardContent>
        <Card.CardFooter>
          <Button key="start" onClick={start} >
            {!isReady && <Loader2 className="animate-spin" />}
            {status_text[transportState as keyof typeof status_text]}
          </Button>
        </Card.CardFooter>
      </Card.Card>
    </div>
  );
}
