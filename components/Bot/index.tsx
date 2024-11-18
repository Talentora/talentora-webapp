'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RTVIClientAudio,RTVIClientProvider } from 'realtime-ai-react';
import { BotLLMTextData, LLMHelper, RTVIClient, RTVIEvent, RTVIMessage, TranscriptData, TransportState } from 'realtime-ai';
import App from '@/components/Bot/App';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Splash from "@/components/Bot/Splash";

type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;

interface BotProps {
  bot: Tables<'bots'>;
  jobInterviewConfig: Tables<'job_interview_config'>;
  companyContext: Tables<'company_context'>;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
}

export default function Bot(botProps: BotProps) {
  const [isUserReady, setIsUserReady] = useState(false);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [transportState, setTransportState] = useState<TransportState>('disconnected');
  const [showSplash, setShowSplash] = useState(true);


  const { job, company, jobInterviewConfig } = botProps;

  if (!job || !company || !jobInterviewConfig) {
    return null;
  }

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const dailyTransport = new DailyTransport();
    const rtviClient = new RTVIClient({
      transport: dailyTransport as any, // Type assertion to fix transport type error
      params: {
        baseUrl: "/api/bot",
        services: {
          stt: "deepgram",
          llm: "together", 
          tts: "cartesia"
        },
        config: [
          {
            service: "tts",
            options: [
              { 
                name: "voice", 
                value: "79a125e8-cd45-4c13-8a67-188112f4dd22" 
              }
            ]
          },
          {
            service: "llm",
            options: [
              { 
                name: "model", 
                value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" 
              },
              {
                name: "messages",
                value: [
                  {
                    role: "system",
                    content: `You are an AI interviewer conducting an interview for the ${job?.name || ''} position at ${company?.name || ''}. 
                    Assess the candidate's qualifications and experience professionally.
                    Keep responses clear and concise. Avoid special characters except '!' or '?'.`
                  }
                ]
              }
            ]
          }
        ]
      },
      enableMic: false,
      enableCam: true,
      timeout: 15000,
    });


    const llmHelper = new LLMHelper({});
    rtviClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = rtviClient;

    console.log("[EVENT] Bot created");

    // rtviClient.initDevices();

    rtviClient.on(RTVIEvent.TransportStateChanged, (state: TransportState) => {
      console.log("[EVENT] Transport state:", state);
      setTransportState(state);
      if (state === 'ready' && isUserReady) {
        rtviClient.connect().catch(error => {
          console.error('Failed to connect:', error);
        });
      }
    });

  
  }, [ botProps, isUserReady]);



  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} company={company} job={job} />;
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <App {...botProps}  />
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
