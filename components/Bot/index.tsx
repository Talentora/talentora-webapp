'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';
import { 
  RTVIClient, 
  RTVIEvent, 
  TransportState,
  BotLLMTextData,
  TranscriptData,
  Participant
} from 'realtime-ai';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import App from '@/components/Bot/App';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';

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
  const [showSplash, setShowSplash] = useState(true);
  const [isUserReady, setIsUserReady] = useState(false);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [transportState, setTransportState] = useState<TransportState>('disconnected');

  const { job, company, jobInterviewConfig } = botProps;

  if (!job || !company || !jobInterviewConfig) {
    return null;
  }

  useEffect(() => {
    if (voiceClientRef.current || !showSplash) return;

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

    rtviClient.on(RTVIEvent.TransportStateChanged, (state: TransportState) => {
      console.log("[EVENT] Transport state:", state);
      setTransportState(state);
      if (state === 'ready' && isUserReady) {
        rtviClient.connect().catch(error => {
          console.error('Failed to connect:', error);
        });
      }
    });

    rtviClient.on(RTVIEvent.BotReady, () => {
      console.log("[EVENT] Bot ready");
    });

    voiceClientRef.current = rtviClient;
    

  }, [showSplash, botProps, isUserReady]);

  const startInterview = async () => {
    setShowSplash(false);
    setIsUserReady(true);

    voiceClientRef.current?.initDevices();


    // try {
    //   await voiceClientRef.current.connect();
    // } catch (error) {
    //   console.error('Failed to start interview:', error);
    //   voiceClientRef.current.disconnect();
    // }
  };

  if (showSplash) {
    return (
      <main className="w-full flex items-center justify-center bg-primary-200 p-4">
        <div className="flex flex-col gap-8 items-center max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight">
              AI Interview for {job.name}
            </h1>
            <p className="text-xl text-primary-500">
              at {company.name}
            </p>
            <Button 
              onClick={startInterview}
              disabled={transportState === 'connecting'}
            >
              Start Interview
            </Button>
        </div>
      </main>
    );
  }


  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
      <App {...botProps} />
      <VoiceClientAudio />
    </VoiceClientProvider>
  );
}
