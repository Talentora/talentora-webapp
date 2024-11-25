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
  bot: Tables<'bots'>;
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


  const { job, company, jobInterviewConfig, application, mergeJob, bot} = botProps;

  const voice: voice = bot.voice as voice;
  const description = bot.description;
  const prompts = bot.prompt;
  const emotion: {
    anger: number;
    speed: number;
    sadness: number;
    surprise: number;
    curiosity: number;
    positivity: number;
  } = bot.emotion as {
    anger: number;
    speed: number;
    sadness: number;
    surprise: number;
    curiosity: number;
    positivity: number;
  } || { // Provide a default value to avoid null assignment
    anger: 0,
    speed: 0,
    sadness: 0,
    surprise: 0,
    curiosity: 0,
    positivity: 0,
  };


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
          config: [
            {
              service: "tts", 
              options: [{ name: "voice", value: voice.id }]
            },
            {
              service: "llm",
              options: [
                { name: "model", value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
                {
                  name: "initial_messages",
                  value: [
                    {
                      role: "system",
                      content: defaultLLMPrompt
                    },
                    {
                      role: "system",
                      content: `You are an AI interviewer name ${bot.name}. You are interviewing a candidate for a job - ${mergeJob.name}. Here's the job description: ${mergeJob.description}`
                    },
                    {
                      role: "system",
                      content: `Here's some additional information about the company: ${company.description}`
                    },
                    {
                      role: "system",
                      content: `Here's are some sample interview questions: ${JSON.stringify(jobInterviewConfig.interview_questions)}`
                    },
                    {
                      role: "system", 
                      content: `This is the ${jobInterviewConfig.interview_name} ${jobInterviewConfig.type} interview. You are an AI interviewer with the role of ${bot.role}. Here's some additional information about you: ${description}. You've been given the following instructions: ${prompts}`
                    }
                  ]
                },
                { name: "run_on_config", value: true }
              ]
            },
            ...defaultConfig.filter(config => config.service !== "llm" && config.service !== "tts")
          ],
        },
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
