'use client';

import { useCallback, useEffect, useState } from 'react';
import { CoinsIcon, Ear, Loader2 } from 'lucide-react';
import { LLMHelper, VoiceError, VoiceEvent, VoiceMessage } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState
} from 'realtime-ai-react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import Session from './Session';
import { Configure } from './Setup';

const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...'
};

import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;

interface AppProps {
  job: Job;
}

export default function App({ job }: AppProps) {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();

  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  useVoiceClientEvent(
    VoiceEvent.Error,
    useCallback((message: VoiceMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || appState !== 'idle') return;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  useEffect(() => {
    // Update app state based on voice client transport state.
    // We only need a subset of states to determine the ui state,
    // so this effect helps avoid excess inline conditionals.
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

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      // Disable the mic until the bot has joined
      // to avoid interrupting the bot's welcome message
      voiceClient.enableMic(false);
      addJobContext();
      await voiceClient.start();
    } catch (e) {
      setError((e as VoiceError).message || 'Unknown error occured');
      voiceClient.disconnect();
    }
  }

  async function leave() {
    await voiceClient.disconnect();
  }

  /**
   * UI States
   */

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
      <Session
        state={transportState}
        onLeave={() => leave()}
        startAudioOff={startAudioOff}
      />
    );
  }

  // Default: show setup view
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
            // fullWidthMobile
            onClick={() => start()}
            disabled={!isReady}
          >
            {!isReady && <Loader2 className="animate-spin" />}
            {status_text[transportState as keyof typeof status_text]}
          </Button>
        </Card.CardFooter>
      </Card.Card>
    </div>
  );
}