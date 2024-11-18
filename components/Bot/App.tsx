'use client';

import { useEffect, useState } from 'react';
import { useVoiceClient, useVoiceClientTransportState } from 'realtime-ai-react';
import { useRecording } from '@daily-co/daily-react';
import VoiceInterviewSession from '@/components/Bot/VideoInterviewSession';
import { Alert } from '@/components/ui/alert';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import { TransportState } from 'realtime-ai';
import { useVoiceClientContext } from './Context';
import { Configure } from './Setup/Configure';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
type BotConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;

interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
}

export default function App({ bot, jobInterviewConfig, companyContext, job, company, mergeJob }: BotProps) {
  const voiceClient = useVoiceClientContext()!;
  const { startRecording, stopRecording } = useRecording();
  const [error, setError] = useState<string | null>(null);
  const transportState = useVoiceClientTransportState();
  const [startAudioOff, setStartAudioOff] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);


  async function start() {
    setError(null);

    const connectionTimeout = setTimeout(() => {
      if (transportState !== 'ready') {
        setError('Bot failed to join. Server may be busy. Please try again later.');
        voiceClient.disconnect();
      }
    }, 15000);

    try {
      setInterviewStarted(true);
      await voiceClient.enableCam(true);
      startRecording();
      await voiceClient.connect();
      clearTimeout(connectionTimeout);
    } catch (e) {
      clearTimeout(connectionTimeout);
      setError('Unable to authenticate. Server may be offline or busy.');
      await voiceClient.disconnect();
    }
  }

  async function leave() {
    try {
      stopRecording();
      await voiceClient.disconnect();
      window.location.reload();
    } catch (error) {
      console.error('Error during leave:', error);
    }
  }

  const handleStartAudioOff = () => {
    setStartAudioOff(prev => !prev);
  };

  const handleUserInteraction = () => {
    setHasUserInteracted(true);
  };

  if (error) {
    return (
      <Alert className="bg-destructive text-destructive-foreground">
        <p>{error}</p>
      </Alert>
    );
  }

  if (!hasUserInteracted) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Welcome to your AI Interview</h1>
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to begin an AI-powered interview with {company.name}. This interview is conducted by Talentora's advanced AI interviewer, designed to assess your qualifications for the {job.name} position.
          </p>
          <p className="text-gray-600">
            The AI interviewer will ask you relevant questions about your experience and skills. Please speak naturally and clearly when responding.
          </p>
          <p className="text-gray-600 font-medium">
            Tips for a successful interview:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Ensure you're in a quiet environment</li>
            <li>Check your camera and microphone are working</li>
            <li>Speak clearly and take your time with responses</li>
          </ul>
        </div>
        <Button 
          onClick={handleUserInteraction}
          className="w-full mt-6 px-4 py-3 bg-primary-dark text-white rounded-lg hover:bg-accent font-medium"
        >
          Start Interview
        </Button>
      </div>
    );
  }


  // if (transportState == 'ready') {
  if (interviewStarted) {
    return (
      <VoiceInterviewSession
        // state={transportState}
        onLeave={leave}
        job={mergeJob}
        company={company}
        startAudioOff={false}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 w-3/4">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-4">Configure your devices</h1>
        <p className="text-gray-600 mb-4">Please ensure your microphone and camera are working properly.</p>
        <Configure
          state={transportState}
          startAudioOff={startAudioOff}
          handleStartAudioOff={handleStartAudioOff}
        />
        <Button 
          onClick={start} 
          className="mt-4"
        >
          Click to Begin
        </Button>
      </CardContent>
    </Card>
  );
}