'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RTVIClientAudio,RTVIClientProvider } from 'realtime-ai-react';
import { BotLLMTextData, LLMHelper, Participant, RTVIActionRequestData, RTVIClient, RTVIEvent, RTVIMessage, TranscriptData, TransportState } from 'realtime-ai';
import App from '@/components/Bot/App';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Splash from "@/components/Bot/Splash";
import { BOT_READY_TIMEOUT } from '@/utils/rtvi.config';
import { defaultConfig } from '@/utils/rtvi.config';
import { defaultServices } from '@/utils/rtvi.config';

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
  const [transcript, setTranscript] = useState<TranscriptData[]>([]);

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
      transport: dailyTransport as any,
      params: {
        baseUrl: "/api/bot",
        requestData: {
          services: defaultServices,
          config: defaultConfig,
        },
      },
      timeout: BOT_READY_TIMEOUT,
      enableMic: true,
      enableCam: true,
    });

    const llmHelper = new LLMHelper({});
    rtviClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = rtviClient;

    console.log("[EVENT] Bot created");


    rtviClient.on(RTVIEvent.TransportStateChanged, (state: TransportState) => {
      console.log("[EVENT] Transport state:", state);
      setTransportState(state);
      if (state === 'ready' && isUserReady) {
        rtviClient.connect().catch(error => {
          console.error('Failed to connect:', error);
        });
      }
    });


    rtviClient.on(RTVIEvent.BotStartedSpeaking, () => {
      console.log("[EVENT] Bot started speaking");
    });

    rtviClient.on(RTVIEvent.BotStoppedSpeaking, () => {
      console.log("[EVENT] Bot stopped speaking");
    });

    rtviClient.on(RTVIEvent.BotTranscript, (transcript: TranscriptData) => {
      console.log("[EVENT] Bot transcript:", transcript);
      setTranscript(prev => [...prev, { ...transcript, role: 'bot' }]);
    });

    rtviClient.on(RTVIEvent.UserTranscript, (transcript: TranscriptData) => {
      console.log("[EVENT] User transcript:", transcript);
      setTranscript(prev => [...prev, { ...transcript, role: 'user' }]); 
    });

    
    rtviClient.on(RTVIEvent.MessageError, (message: RTVIMessage) => {
      console.error("[EVENT] Message error:", message);
    });

    rtviClient.on(RTVIEvent.Error, (message: RTVIMessage) => {
      console.error("[EVENT] Bot error:", message);
    });

    rtviClient.on(RTVIEvent.ParticipantConnected, async (participant: Participant) => {
      console.log("[EVENT] Participant connected:", participant);
      // Greet the user when the bot joins
      if (participant.local) {
        const response = await rtviClient.action({
          service: "tts",
          action: "say", 
          arguments: [{ 
            name: "text",
            value: "Hello! I'm your AI interviewer today. I'll be asking you some questions to learn more about your experience and qualifications. Let's get started!"
          }],
        } as RTVIActionRequestData);
      }
    });
  
  }, [ botProps, isUserReady]);



  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} company={company} job={job} />;
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <App {...botProps} transcript={transcript} />
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
