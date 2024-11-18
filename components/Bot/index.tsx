'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VoiceClientAudio } from 'realtime-ai-react';
import { RTVIClient, RTVIEvent, TransportState } from 'realtime-ai';
import App from '@/components/Bot/App';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import { VoiceClientProvider } from './Context';

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

  const { job, company, jobInterviewConfig } = botProps;

  if (!job || !company || !jobInterviewConfig) {
    return null;
  }

  useEffect(() => {

    const transport = new DailyTransport();
    const rtviClient = new RTVIClient({
      transport,
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
                    content: `You are an AI interviewer conducting an interview for the ${job.name} position at ${company.name}. 
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

    console.log("[EVENT] Bot created");

    rtviClient.initDevices();

    rtviClient.on(RTVIEvent.TransportStateChanged, (state: TransportState) => {
      console.log("[EVENT] Transport state:", state);
      setTransportState(state);
      if (state === 'ready' && isUserReady) {
        rtviClient.connect().catch(error => {
          console.error('Failed to connect:', error);
        });
      }
    });

    voiceClientRef.current = rtviClient;

    // Cleanup function to disconnect and reset the ref
    return () => {
      rtviClient.disconnect();
      voiceClientRef.current = null;
    };
  }, [ botProps, isUserReady]);

  const startInterview = async () => {
    setIsUserReady(true);

    try {
      await voiceClientRef.current?.connect();
    } catch (error) {
      console.error('Failed to start interview:', error);
      voiceClientRef.current?.disconnect();
    }
  };

  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
      <App {...botProps}  />
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
