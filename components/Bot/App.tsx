'use client';

import { useCallback, useEffect, useState } from 'react';
import { CoinsIcon, Ear, Loader2 } from 'lucide-react';
import { LLMHelper, VoiceError, VoiceEvent, VoiceMessage } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState
} from 'realtime-ai-react';
import VoiceInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Configure } from './Setup';

import { Tables } from '@/types/types_db';

/**
 * Mapping of transport states to status text
 */
const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...'
};

/**
 * Type definition for Job from database schema
 */
type Job = Tables<'jobs'>;

/**
 * Props interface for App component
 */
interface AppProps {
  job: Job;
}

/**
 * Main App component for the AI interviewer
 * @param {AppProps} props - The props for the App component
 * @returns {JSX.Element} The rendered App component
 */
export default function App({ job }: AppProps) {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();

  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  /**
   * Handle fatal errors from the voice client
   */
  useVoiceClientEvent(
    VoiceEvent.Error,
    useCallback((message: VoiceMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  /**
   * Initialize local audio devices when the app is idle
   */
  useEffect(() => {
    if (!voiceClient || appState !== 'idle') return;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  /**
   * Update app state based on voice client transport state
   */
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

  /**
   * Add job context to the LLM helper
   */
  function addJobContext() {
    if (!voiceClient) return;

    const llmHelper = voiceClient.getHelper('llm') as LLMHelper;
    llmHelper.setContext(
      {
        messages: [
          {
            role: 'system',
            content: `You are an AI interviewer for a ${job.title} role. 
          The job requirements are: ${job.requirements}
          The qualifications needed are: ${job.qualifications}
          Here's a brief description of the role: ${job.description}. Conduct a real interview.
          When you greet the applicant, introduce yourself and mention the job title.
          Conduct the interview based on this information.`
          }
        ]
      },
      true
    );
  }

  /**
   * Start the interview session
   */
  async function start() {
    if (!voiceClient) return;

    try {
      voiceClient.enableMic(false);
      voiceClient.enableCam(true);
      addJobContext();
      await voiceClient.start();
    } catch (e) {
      setError((e as VoiceError).message || 'Unknown error occurred');
      voiceClient.disconnect();
    }
  }

  /**
   * Leave the interview session
   */
  async function leave() {
    await voiceClient.disconnect();
  }

  // Render error message if an error occurred
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  // Render session view if connected
  if (appState === 'connected') {
  return (
    // <Session
    //   state={transportState}
    //   onLeave={() => leave()}
    //   startAudioOff={startAudioOff}
    // />
    <VoiceInterviewSession
      state={transportState}
      onLeave={() => leave()}
      startAudioOff={startAudioOff}
      job={job}
    />
  );
  }

  // Render setup view by default
  const isReady = appState === 'ready';

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card.Card shadow className="w-1/2">
        <Card.CardHeader>
          <Card.CardTitle>Configuration</Card.CardTitle>
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
          <Button
            key="start"
            onClick={() => start()}
            disabled={
              !isReady 
            
            }
          >
            {!isReady && <Loader2 className="animate-spin" />}
            {status_text[transportState as keyof typeof status_text]}
          </Button>
        </Card.CardFooter>
      </Card.Card>
    </div>
  );
}
