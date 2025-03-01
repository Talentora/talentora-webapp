'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  RTVIClientProvider,
} from "@pipecat-ai/client-react";
import { RTVIClient } from "@pipecat-ai/client-js";
import App from '@/components/Bot/App';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Splash from '@/components/Bot/Splash';
import { BOT_READY_TIMEOUT } from '@/utils/rtvi.config';
import { useToast } from '@/hooks/use-toast';
import { TranscriptData } from '@pipecat-ai/client-js';
import { InterviewTranscript, InterviewTranscriptEntry } from '@/types/transcript';

type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;

interface BotProps {
  scout: Tables<'bots'>;
  jobInterviewConfig: Tables<'job_interview_config'> | null;
  companyContext: Tables<'company_context'>;
  job: Job | null;
  company: Company;
  mergeJob: MergeJob | null;
  application: Tables<'applications'> | null;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
}

type TransportState = 'disconnected' | 'initialized' | 'ready' | 'connecting' | 'connected' | 'error';



export default function Bot(botProps: BotProps) {
  const [isUserReady, setIsUserReady] = useState(false);
  const clientRef = useRef<RTVIClient | null>(null);
  const [transportState, setTransportState] = useState<TransportState>('disconnected');
  const [showSplash, setShowSplash] = useState(true);
  const [transcript, setTranscript] = useState<InterviewTranscript>([]);
  const mountedRef = useRef(false);
  const { toast } = useToast();

  const {
    job,
    company,
    jobInterviewConfig,
    application,
    mergeJob,
    scout,
    companyContext,
    enableRecording,
    demo,
    scoutTest,
  } = botProps;

  const voice = scout.voice;
  const emotion = scout.emotion;

  // Set mounted ref on component mount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initialize client only once
  useEffect(() => {
    if (!showSplash || clientRef.current || !mountedRef.current) {
      return;
    }

    console.log('[INIT] Creating new client instance');
    
    const dailyTransport = new DailyTransport();
    const pipecatClient = new RTVIClient({
      transport: dailyTransport,
      enableMic: true, // Start with mic off until user explicitly enables
      enableCam: true, // Start with camera off until user explicitly enables
      params: {
        baseUrl: '/api/bot',
        endpoints: {
          connect: '/connect',
        },
        requestData: {
          data: {
            voice: voice,
            job: mergeJob,
            company: company,
            jobInterviewConfig: jobInterviewConfig,
            application: application,
            bot: scout,
            companyContext: companyContext,
            emotion: emotion,
            enableRecording: enableRecording,
            scoutTest: scoutTest,
            demo: demo
          }
        },
        timeout: BOT_READY_TIMEOUT
      }
    });

    clientRef.current = pipecatClient;
    console.log('[INIT] Client created successfully');

    // Set up event listeners
    const eventHandlers = {
      transportStateChanged: (state: string) => {
        console.log('[EVENT] Transport state:', state);
        setTransportState(state as TransportState);
      },
      onUserTranscript: (data: TranscriptData) => {
        const userEntry: InterviewTranscriptEntry = {
          ...data,
          role: 'user',
          timestamp: new Date().toISOString()
        };
        setTranscript(prev => [...prev, userEntry]);
      },
      onBotTranscript: (data: TranscriptData) => {
        const botEntry: InterviewTranscriptEntry = {
          ...data,
          role: 'bot',
          timestamp: new Date().toISOString()
        };
        setTranscript(prev => [...prev, botEntry]);
      },
      error: (error: any) => {
        console.error('[EVENT] Bot error:', error);
        toast({
          title: "Error",
          description: error.message || 'An unknown error occurred',
          variant: "destructive"
        });
      },
      disconnected: () => {
        console.log('[EVENT] Bot disconnected');
        toast({
          title: "Disconnected",
          description: "Bot disconnected from session",
          variant: "destructive"
        });
      }
    };

    // Attach event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      pipecatClient.on(event as any, handler);
    });

    // Cleanup event handlers
    return () => {
      if (pipecatClient) {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          pipecatClient.off(event as any, handler);
        });
      }
    };

  }, [showSplash, voice, mergeJob, company, jobInterviewConfig, application, scout, companyContext, emotion, enableRecording, scoutTest, demo, toast]);


  if (showSplash) {
    return (
      <>
 
        <Splash
          handleReady={() => {
            setShowSplash(false);
            setIsUserReady(true);
          }}
          company={company}
          mergeJob={mergeJob}
          enableRecording={enableRecording}
          demo={demo}
          scoutTest={scoutTest}
        />
      </>
    );
  }

  if (!demo && (!job || !company || !jobInterviewConfig)) {
    return null;
  }

  if (!clientRef.current) {
    console.log('Waiting for client to be initialized...');
    return null;
  }

  return (
    <>
      
        <RTVIClientProvider client={clientRef.current}>
          <App {...botProps} transcript={transcript} />
        </RTVIClientProvider>
    </>
  );
}
