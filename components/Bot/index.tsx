'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RTVIClientAudio,RTVIClientProvider } from 'realtime-ai-react';
import { BotLLMTextData, LLMHelper, Participant, RTVIActionRequestData, RTVIClient, RTVIEvent, RTVIMessage } from 'realtime-ai';
import App from '@/components/Bot/App';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Splash from "@/components/Bot/Splash";
import { BOT_READY_TIMEOUT, defaultLLMPrompt } from '@/utils/rtvi.config';
import { defaultConfig } from '@/utils/rtvi.config';
import { defaultServices } from '@/utils/rtvi.config';

type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;

interface BotProps {
  scout: Tables<'bots'>;
  jobInterviewConfig: Tables<'job_interview_config'>;
  companyContext: Tables<'company_context'>;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  application: Tables<'applications'>;
}

type voice = {
  id: string;
  name: string;
  gender: string;
  language: string;
  embedding: number[];
  is_public: boolean;
  api_status: string;
  created_at: string;
  description: string;
}
 

type TranscriptData = {
  // speaker: string;
  text: string;
  role: 'bot' | 'user';
}

import { useRouter } from 'next/navigation';

export default function Bot(botProps: BotProps) {
  const [isUserReady, setIsUserReady] = useState(false);
  const voiceClientRef = useRef(null);
  const [transportState, setTransportState] = useState('disconnected');
  const [showSplash, setShowSplash] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptData[]>([]);
  const router = useRouter();


  const { job, company, jobInterviewConfig, application, mergeJob, scout, companyContext} = botProps;

  const voice = scout.voice;
  const description = scout.description;
  const prompts = scout.prompt;
  const emotion = scout.emotion;
  const defaultEmotion = {
    anger: 0,
    speed: 0, 
    sadness: 0,
    surprise: 0,
    curiosity: 0,
    positivity: 0
  };
  // const emotion = bot.emotion ? bot.emotion as typeof defaultEmotion : defaultEmotion;


  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const dailyTransport = new DailyTransport();
    
    // const callObject = dailyTransport.
    
    // callObject?.setMeetingSessionData({
    //   data: {
    //     jobId: mergeJob.id,
    //     jobName: mergeJob.name,
    //     jobDescription: mergeJob.description,
    //     companyId: company.id,
    //     companyName: company.name,
    //     applicationId: application.id,
    //     assessmentStartTime: new Date().toISOString()
    //   }
    // }, 'shallow-merge');
  
    const rtviClient = new RTVIClient({
      transport: dailyTransport as any,
      params: {
        baseUrl: "/api/bot",
        requestData: {
          data: {
            voice: voice,
            job: mergeJob,
            company: company,
            jobInterviewConfig: jobInterviewConfig,
            application: application,
            bot: scout,
            companyContext: companyContext,
            emotion: emotion
          }
        }
      },
      timeout: BOT_READY_TIMEOUT,
      enableMic: true,
      enableCam: true,
      
    });



    const llmHelper = new LLMHelper({});
    rtviClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = rtviClient as any;

    console.log("[EVENT] Bot created");


    rtviClient.on(RTVIEvent.TransportStateChanged, (state: string) => {
      console.log("[EVENT] Transport state:", state);
      setTransportState(state);
      if (state === 'ready' && isUserReady) {
        rtviClient.connect().catch((error: Error) => {
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

    rtviClient.on(RTVIEvent.BotTranscript, (transcript: any) => {
      console.log("[EVENT] Bot transcript:", transcript);
      setTranscript(prev => [...prev, { ...transcript, role: 'bot' }]);
    });

    rtviClient.on(RTVIEvent.UserTranscript, (transcript: any) => {
      console.log("[EVENT] User transcript:", transcript);
      setTranscript(prev => [...prev, { ...transcript, role: 'user' }]); 
    });


    rtviClient.on(RTVIEvent.MessageError, (message: RTVIMessage) => {
      console.error("[EVENT] Message error:", message);
    });

    rtviClient.on(RTVIEvent.Error, (message: RTVIMessage) => {
      console.error("[EVENT] Bot error:", message);
    });

    rtviClient.on("disconnected", () => {
      console.log("[EVENT] Bot disconnected");
      // router.push('/assessment/conclusion');
    });

    rtviClient.on(RTVIEvent.ParticipantConnected, async (participant: Participant) => {
      console.log("[EVENT] Participant connected:", participant);
      // Greet the user when the bot joins
      
    });

    
     
  
  }, [ botProps, isUserReady, showSplash]);



  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} company={company} mergeJob={mergeJob} />;
  }

  if (!job || !company || !jobInterviewConfig) {
    return null;
  }

  return (
      <RTVIClientProvider client={voiceClientRef.current!}>
        <App {...botProps} transcript={transcript} />
        <RTVIClientAudio />
      </RTVIClientProvider>
  );
}
