import { useEffect, useState } from 'react';
import { Ear, Loader2 } from 'lucide-react';
import { RateLimitError } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientTransportState
} from 'realtime-ai-react';

import Session from '@/components/Session';
import { Configure } from '@/components/Setup';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { BOT_READY_TIMEOUT } from '@/utils/config';

const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  handshaking: 'Requesting agent...',
  connecting: 'Connecting...'
};

export default function App() {
  const voiceClient = useVoiceClient()!;

  const transportState = useVoiceClientTransportState();
  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  useEffect(() => {
    // Initialize local audio devices
    if (!voiceClient || transportState !== 'idle') return;
    voiceClient.initDevices();
  }, [transportState, voiceClient]);

  useEffect(() => {
    // Update the app state based on the transport state
    // We only need a substate of states for the different view states
    // so this method helps avoid inline conditionals.
    switch (transportState) {
      case 'initialized':
        setAppState('ready');
        break;
      case 'handshaking':
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

    // Set a timeout and check for join state, incase under heavy load
    setTimeout(() => {
      if (voiceClient.state !== 'ready') {
        setError(
          'Bot failed to join or enter ready state. Server may be busy. Please try again later.'
        );
        voiceClient.disconnect();
      }
    }, BOT_READY_TIMEOUT);

    // Join the session
    try {
      // Disable the mic until the bot has joined
      voiceClient.enableMic(false);
      await voiceClient.start();
    } catch (e) {
      if (e instanceof RateLimitError) {
        setError('Demo is currently at capacity. Please try again later.');
      } else {
        setError(
          'Unable to authenticate. Server may be offline or busy. Please try again later.'
        );
      }
      return;
    }
  }

  async function leave() {
    await voiceClient.disconnect();
    // Reload the page to reset the app (this avoids transport specific reinitalizing issues)
    window.location.reload();
  }

  if (error) {
    return <Alert title="An error occurred">{error}</Alert>;
  }

  // session page
  if (appState === 'connected') {
    return (
      <Session
        state={transportState}
        onLeave={() => leave()}
        startAudioOff={startAudioOff}
      />
    );
  }

  const isReady = appState === 'ready';

  // loading/settings page
  return (
    <Card.Card shadow className="animate-appear max-w-lg mb-14">
      <Card.CardHeader>
        <Card.CardTitle className="text-primary-200">
          Configuration
        </Card.CardTitle>
        <Card.CardDescription>
          Please configure your devices and pipeline settings below
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent stack>
        <div className="flex flex-row gap-2 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty text-primary-200">
          <Ear className="size-7 md:size-5 text-primary-400" />
          Works best in a quiet environment with a good internet.
        </div>
        <h1>Transport State {voiceClient.state}</h1>
        <Configure
          startAudioOff={startAudioOff}
          handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
        />
      </Card.CardContent>
      <Card.CardFooter>
        <Button
          className="bg-primary-200 text-primary-900"
          key="start"
          onClick={() => start()}
          disabled={!isReady}
        >
          {!isReady && <Loader2 className="animate-spin" />}
          {status_text[transportState as keyof typeof status_text]}
        </Button>
      </Card.CardFooter>
    </Card.Card>
  );
}
