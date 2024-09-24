"use client";

import { useEffect, useRef, useState } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LLMHelper } from "realtime-ai";
import { DailyVoiceClient } from "realtime-ai-daily";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import App from "@/components/Bot/App";
import { CharacterProvider } from "@/components/Bot/context";
import Splash from "@/components/Bot/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices,
} from "@/utils/rtvi.config";

import { Tables } from "@/types/types_db";
type Job = Tables<'jobs'>


interface BotProps {
  job: Job | null;
}

export default function Bot({job}:BotProps) {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<DailyVoiceClient | null>(null);  


  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }
    const voiceClient = new DailyVoiceClient({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
      services: defaultServices,
      config: defaultConfig,
      timeout: BOT_READY_TIMEOUT,
      enableCam: true,
    });
    const llmHelper = new LLMHelper({
      callbacks: {
        onLLMFunctionCall: () => {
          const audio = new Audio("shutter.mp3");
          audio.play();
        },
      },
    });
    
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
  }, [showSplash, job]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
      <CharacterProvider>
        <TooltipProvider>
                <main>
                
                <div id="app">
                {job && <App job={job} />}
                </div>
          </main>
          
          <aside id="tray" />
        </TooltipProvider>
      </CharacterProvider>
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
