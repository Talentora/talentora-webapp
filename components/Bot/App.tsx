'use client';

import { useCallback, useEffect, useState } from 'react';
import { CoinsIcon, Ear, Loader2 } from 'lucide-react';
import { LLMHelper, VoiceError, VoiceEvent, VoiceMessage } from 'realtime-ai';
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState
} from 'realtime-ai-react';

import { useRecording } from '@daily-co/daily-react';

import VoiceInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Configure } from './Setup';

/**
 * Mapping of transport states to status text
 */
const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...'
};

import { Tables } from '@/types/types_db';
type BotConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type Application = Tables<'applications'>;
import { Job as MergeJob } from '@/types/merge';
import { Candidate as MergeCandidate } from '@/types/merge';
import InterviewConfig from '../InterviewConfig';

interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  // applicationData: MergeCandidate;
}

/**
 * Type definition for Job from database schema
 */

/**
 * Main App component for the AI interviewer
 * @param {AppProps} props - The props for the App component
 * @returns {JSX.Element} The rendered App component
 */
export default function App({ bot, jobInterviewConfig, companyContext, job, company, mergeJob }: BotProps) {
  const voiceClient = useVoiceClient()!;
  const transportState = useVoiceClientTransportState();
  const recording = useRecording();

  const [appState, setAppState] = useState<
    'idle' | 'ready' | 'connecting' | 'connected'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  /**
   * Handle fatal errors from the voice client
   */
  useVoiceClientEvent(
    VoiceEvent.Error,
    useCallback((message: VoiceMessage) => {
      const errorData = message.data as { error: string; fatal: boolean };
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );

  /**
   * Initialize local audio devices when the app is idle
   */
  useEffect(() => {
    if (!voiceClient || appState !== 'idle') return;
    voiceClient.initDevices();
  }, [appState, voiceClient]);

  /**
   * Update app state based on voice client transport state
   */
  useEffect(() => {
    console.log('Transport state changed:', transportState);
    switch (transportState) {
      case 'initialized':
        console.log('Setting app state to ready');
        setAppState('ready');
        break;
      case 'authenticating':
      case 'connecting':
        console.log('Setting app state to connecting');
        setAppState('connecting');
        break;
      case 'connected':
      case 'ready':
        console.log('Setting app state to connected');
        setAppState('connected');
        break;
      default:
        console.log('Setting app state to idle');
        setAppState('idle');
    }
  }, [transportState]);

  /**
   * Add job context to the LLM helper
   */
  // function addJobContext() {
  //   if (!voiceClient) return;

  //   const llmHelper = voiceClient.getHelper('llm') as LLMHelper;
  //   llmHelper.setContext(
  //     {
  //       messages: [
  //         {
  //           role: 'system',
  //           content: `
  //             Your name is ${bot.name}. You're an AI interviewer for a ${mergeJob.name} role at ${company.name}.
            
  //             When you greet the applicant:
  //             1. Introduce yourself as ${bot.name}
  //             2. Mention you're interviewing for the ${mergeJob.name} position at ${company.name}
  //             3. Briefly explain the interview process
              
  //             Conduct a professional interview based on this information.
  //           `
  //         },
  //         {
  //           role: 'system',
  //           content: `
  //             Here's information about you the recruiter:
  //             Recruiter Name: ${bot.name}
  //             Recruiter Role: ${bot.role}
  //             Here's your prompt which may include instructions for the interview: ${bot.prompt}
  //           `
  //         },
  //         // {
  //         //   role: 'system',
  //         //   content: `
  //         //     Here's the candidate's information:
  //         //     ${applicationData.name}
  //         //     ${applicationData.experience}
  //         //   `
  //         // },
  //         {
  //           role: 'system',
  //           content: `
  //             Here's information about this interview:
  //             Interview Name: ${jobInterviewConfig.interview_name}
  //             Interview Questions: ${jobInterviewConfig.interview_questions}
  //             Interview Type: ${jobInterviewConfig.type}
  //             Interview Duration: ${jobInterviewConfig.duration}
  //           `
  //         },
  //         {
  //           role: 'system',
  //           content: `
  //             Here's the company context:

  //             Company Name: ${company.name}
  //             Company Industry: ${company.industry}
  //             Company Description: ${companyContext.description}
  //             Company Goals: ${companyContext.goals}
  //             Company History: ${companyContext.history}
  //             Company Products: ${companyContext.products}
  //             Company Customers: ${companyContext.customers}
  //           `
  //         },
  //         {
  //           role: 'system',
  //           content: `
  //             Here's the job information:
  //             Job Name: ${mergeJob.name}
  //             Job Description: ${mergeJob.description}
  //           `
  //         }
  //       ]
  //     },
  //     true
  //   );
  // }

  /**
   * Start the interview session
   */
  async function start() {
    if (!voiceClient) {
      console.log('No voice client available, aborting start');
      return;
    }

    console.log('Starting interview session');
    try {
      console.log('Disabling microphone');
      voiceClient.enableMic(false);
      console.log('Enabling camera');
      voiceClient.enableCam(true);
      console.log('Starting recording');
      recording.startRecording();
      console.log('Adding job context');
      // addJobContext();
      console.log('Initializing voice client');
      await voiceClient.start();
      console.log('Interview session started successfully');
    } catch (e) {
      console.error('Error starting interview session:', e);
      setError((e as VoiceError).message || 'Unknown error occurred');
      console.log('Disconnecting voice client due to error');
      voiceClient.disconnect();
    }
  }

  /**
   * Leave the interview session
   */
  async function leave() {
    if (voiceClient) {
      console.log('Leaving interview session');
      try {
        recording.stopRecording();
        console.log('Recording stopped');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    } else {
      console.log('No active voice client to disconnect');
    }
    await voiceClient.disconnect();
  }

  // Render error message if an error occurred
  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  // Render session view if connected
  if (appState === 'connected') {
    return (
      <VoiceInterviewSession
        state={transportState}
        onLeave={() => leave()}
        startAudioOff={startAudioOff}
        job={mergeJob}
        company={company}
      />
    );
  }

  // Render setup view by default
  const isReady = appState === 'ready';

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card.Card shadow >
        <Card.CardHeader>
          <Card.CardTitle>Configuration</Card.CardTitle>
        </Card.CardHeader>
        <Card.CardContent stack>
          <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm rounded-md font-medium text-pretty">
            <Ear className="size-7 md:size-5 text-primary-400" />
            Works best in a quiet environment with a good internet.
          </div>
          <Configure
            startAudioOff={startAudioOff}
            handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
            state={appState}
          />
        </Card.CardContent>
        <Card.CardFooter>
          <Button key="start" onClick={() => start()} disabled={!isReady}>
            {!isReady && <Loader2 className="animate-spin" />}
            {status_text[transportState as keyof typeof status_text]}
          </Button>
        </Card.CardFooter>
      </Card.Card>
    </div>
  );
}
