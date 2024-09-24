"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LLMHelper } from "realtime-ai";
import { DailyVoiceClient } from "realtime-ai-daily";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

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

    if (job) {
        // adding job info to the bot context
        llmHelper.appendToMessages(
            {
                role: "system",
                content: 
                    `Job Title: ${job?.title}, Job Description: ${job.description}, 
                    Job Requirements: ${job.requirements}, Job Qualifications: ${job.qualifications}`
            },
            true
        );
    }
    
    voiceClient.registerHelper("llm", llmHelper);


    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
      <CharacterProvider>
        <TooltipProvider>
          <main>
            <div className="job-info p-4 bg-white shadow-md rounded-lg">
              <h2 className="job-info__title text-2xl font-bold mb-4">Job Information</h2>
              <div className="job-info__details space-y-2">
                <p className="text-lg"><strong>ID:</strong> {job?.id}</p>
                <p className="text-lg"><strong>Title:</strong> {job?.title}</p>
                <p className="text-lg"><strong>Context:</strong> {}</p>

              </div>
            </div>
            <div id="app">
              <App />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </CharacterProvider>
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
