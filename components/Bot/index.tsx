'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';
import { DailyVoiceClient } from 'realtime-ai-daily';
import { LLMHelper, VoiceClient } from 'realtime-ai';
import { Button } from '@/components/ui/button';
import { DailyTransport } from '@daily-co/realtime-ai-daily';
import App from '@/components/Bot/App';
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices
} from '@/utils/rtvi.config';
import { Tables } from '@/types/types_db';
type BotConfig = Tables<'bots'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type CompanyContext = Tables<'company_context'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type Application = Tables<'applications'>;
import { Job as MergeJob } from '@/types/merge';
import { Candidate as MergeCandidate } from '@/types/merge';
interface BotProps {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  // applicationData: MergeCandidate;
}

export default function Bot(botProps: BotProps) {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<DailyVoiceClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new DailyVoiceClient({
      // baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
      baseUrl: '/api/bot',
      services: defaultServices,
      config: defaultConfig,
      timeout: BOT_READY_TIMEOUT,
      enableCam: true
    });

    // const dailyTransport = new DailyTransport();

    // const voiceClient = new DailyVoiceClient({
    //   // baseUrl: "/api/connectBot",
    //   baseUrl: '/api/bot',
    //   services: defaultServices,
    //   config: defaultConfig,
    //   timeout: BOT_READY_TIMEOUT,
    //   enableCam: true
    // });

    const llmHelper = new LLMHelper({});

    voiceClient.registerHelper('llm', llmHelper);
    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  if (showSplash) {
    return (
      <main className="w-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
        <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance text-left">
            Talentora
          </h1>

          <p className="text-primary-500 text-xl font-semibold leading-relaxed">
            Enter your interview now
          </p>

          <Button onClick={() => setShowSplash(false)}>Try Demo</Button>
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
