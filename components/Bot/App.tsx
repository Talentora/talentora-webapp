'use client';

import { useEffect, useState, useRef } from 'react';
import { useRTVIClient, useRTVIClientTransportState } from 'realtime-ai-react';
import { useRecording } from '@daily-co/daily-react';
import { DailyEventObject } from '@daily-co/daily-js';
import VideoInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import { RTVIEvent, RTVIMessage, RTVIError } from 'realtime-ai';
import Configure from './Setup';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Ear } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

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
  // transcript: { speaker: string; text: string }[];
}

type TranscriptData = {
  // speaker: string;
  text: string;
  role: 'bot' | 'user';
};

// import { TranscriptData } from 'realtime-ai';
import { useRouter } from 'next/navigation';
const status_text = {
  idle: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...'
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
  const role = user?.user_metadata?.role;

  const voiceClient = useRTVIClient()!;
  const transportState = useRTVIClientTransportState();

  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<RTVIError | null>(null);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const mountedRef = useRef<boolean>(false);
  const applicationId = application?.id;

  const router = useRouter();

  voiceClient.on(RTVIEvent.Error, (message: RTVIMessage) => {
    console.log('Error', message);
    setError(message as unknown as RTVIError);
  });

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || mountedRef.current) return;
    mountedRef.current = true;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  useEffect(() => {
    switch (transportState) {
      case 'initialized':
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
      default:
        setAppState('idle');
    }
  }, [transportState]);

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      await voiceClient.connect();
    } catch (e) {
      setError(e as RTVIError);
      voiceClient.disconnect();
    }
  }

  async function leave() {
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
  }

  // Error: show full screen message
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error.message}
      </Alert>
    );
  }

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

  const isReady = appState === 'ready';

  return (
    <Card className="animate-appear max-w-lg mx-auto mt-8 p-5 bg-background">
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
