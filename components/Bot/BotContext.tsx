'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';
// import { InterviewTranscript } from '@/types/transcript'; // Replace with LiveKit message type
import { User } from '@supabase/supabase-js';
import { ReceivedChatMessage } from '@livekit/components-react'; // Use ReceivedChatMessage


// Define the shape of the context data
interface BotContextType {
  // User/Auth related (consider if this should be in a separate AuthContext)
  user: User | null; 
  role: string | null; // Or a more specific role type

  // Bot/Interview related
  scout: Tables<'bots'>;
  jobInterviewConfig: Tables<'job_interview_config'> | null;
  companyContext: Tables<'company_context'>;
  job: Tables<'jobs'> | null;
  company: Tables<'companies'>;
  mergeJob: MergeJob | null;
  application: Tables<'applications'> | null;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
  // transcript: InterviewTranscript; // Remove old transcript state
  dataMessages: ReceivedChatMessage[]; // Use ReceivedChatMessage[]
  addDataMessage: (message: ReceivedChatMessage) => void; // Use ReceivedChatMessage
  // Add any other shared state or functions if needed
}

// Create the context with a default value (usually null or an empty object)
const BotContext = createContext<BotContextType | null>(null);

// Create a provider component
interface BotProviderProps {
  children: ReactNode;
  value: Omit<BotContextType, 'dataMessages' | 'addDataMessage'>; // Initial value excludes state/functions handled internally
}

export const BotProvider: React.FC<BotProviderProps> = ({ children, value }) => {
  const [dataMessages, setDataMessages] = useState<ReceivedChatMessage[]>([]);

  const addDataMessage = useCallback((message: ReceivedChatMessage) => {
    // Optional: Add filtering or transformation here if needed
    setDataMessages((prev) => [...prev, message]);
  }, []);

  const contextValue: BotContextType = {
    ...value,
    dataMessages,
    addDataMessage,
  };

  return <BotContext.Provider value={contextValue}>{children}</BotContext.Provider>;
};

// Create a custom hook for consuming the context
export const useBotContext = () => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
}; 