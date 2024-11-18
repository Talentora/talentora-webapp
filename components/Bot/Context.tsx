import React, { createContext, useContext, ReactNode } from 'react';
import { RTVIClient } from 'realtime-ai';

interface VoiceClientContextProps {
  voiceClient: RTVIClient | null;
}

const VoiceClientContext = createContext<VoiceClientContextProps | undefined>(undefined);

export const VoiceClientProvider: React.FC<{ voiceClient: RTVIClient; children: ReactNode }> = ({ voiceClient, children }) => {
  return (
    <VoiceClientContext.Provider value={{ voiceClient }}>
      {children}
    </VoiceClientContext.Provider>
  );
};

export const useVoiceClientContext = () => {
  const context = useContext(VoiceClientContext);
  if (!context) {
    throw new Error('useVoiceClientContext must be used within a VoiceClientProvider');
  }
  return context.voiceClient;
};