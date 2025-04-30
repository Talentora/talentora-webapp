'use client';
import React, { useState } from 'react';
import App from '@/components/Bot/App';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
import Splash from '@/components/Bot/Splash';
import { BotProvider } from '@/components/Bot/BotContext';
import { useUser } from '@/hooks/useUser';
import { User } from '@supabase/supabase-js';

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

export default function Bot(botProps: BotProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const userHookValue = useUser();
  const user: User | null = userHookValue.user.data;
  const role: string | null = user?.app_metadata?.role ?? user?.user_metadata?.role ?? null;

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
    scoutTest
  } = botProps;

  const contextValue = {
    user,
    role,
    scout,
    jobInterviewConfig,
    companyContext,
    job,
    company,
    mergeJob,
    application,
    enableRecording,
    demo,
    scoutTest,
    transcript,
  };

  if (showSplash) {
    return (
      <>
        <Splash
          handleReady={() => {
            setShowSplash(false);
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

  return (
    <BotProvider value={contextValue}>
      <App />
    </BotProvider>
  );
}
