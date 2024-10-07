'use client';

import { useEffect, useRef, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LLMHelper } from 'realtime-ai';
import { DailyVoiceClient } from 'realtime-ai-daily';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';

import App from '@/components/Bot/App';
import { CharacterProvider } from '@/components/Bot/context';
import Splash from '@/components/Bot/Splash';
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices
} from '@/utils/rtvi.config';

import { Tables } from '@/types/types_db';

// Define the Job type from the database schema
type Job = Tables<'jobs'>;

// Define the props for the Bot component
interface BotProps {
  job: Job | null;
}

/**
 * Bot component that handles the main functionality of the AI interviewer
 * @param {BotProps} props - The props for the Bot component
 * @returns {JSX.Element} The rendered Bot component
 */
export default function Bot({ job }: BotProps) {
  // State to control the visibility of the splash screen
  const [showSplash, setShowSplash] = useState(true);
  // Ref to store the DailyVoiceClient instance
  const voiceClientRef = useRef<DailyVoiceClient | null>(null);

  useEffect(() => {
    // Only initialize the voice client if the splash screen is shown and the client hasn't been created yet
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    // Create a new DailyVoiceClient instance
    const voiceClient = new DailyVoiceClient({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
      services: defaultServices,
      config: defaultConfig,
      timeout: BOT_READY_TIMEOUT,
      enableCam: true
    });

    // Create an LLMHelper instance for handling language model interactions
    const llmHelper = new LLMHelper({
      callbacks: {
        onLLMFunctionCall: () => {
          // Play a shutter sound when an LLM function is called
          const audio = new Audio('shutter.mp3');
          audio.play();
        }
      }
    });

    // Register the LLMHelper with the voice client
    voiceClient.registerHelper('llm', llmHelper);

    // Store the voice client in the ref
    voiceClientRef.current = voiceClient;
  }, [showSplash, job]);

  // Render the splash screen if it's still visible
  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  // Render the main application
  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
      <CharacterProvider>
        <TooltipProvider>
          <main>
            <p></p>
            <div id="app">
              {/* Render the App component only if a job is provided */}
              {job && <App job={job} />}
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </CharacterProvider>
      {/* Render the VoiceClientAudio component for handling audio */}
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
