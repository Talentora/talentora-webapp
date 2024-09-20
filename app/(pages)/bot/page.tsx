'use client';

import React, { useState } from 'react';
import { VoiceClient } from 'realtime-ai';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';

import { Header } from '@/components/ui/header';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import { defaultConfig } from '@/utils/config';
import { Splash } from './Splash';
import {
  getUser,
  getUserDetails,
  getSubscription
} from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

const voiceClient = new VoiceClient({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  enableMic: true,
  config: defaultConfig
});

const page = async () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <VoiceClientProvider voiceClient={voiceClient}>
      <TooltipProvider>
        <main>
          <Header />
          <div id="app">
            <App />
          </div>
        </main>
        <aside id="tray" />
        <VoiceClientAudio />
      </TooltipProvider>
    </VoiceClientProvider>
  );
};

export default page;
