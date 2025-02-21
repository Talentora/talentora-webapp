import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TranscriptData } from '@pipecat-ai/client-js';
import { useRTVIClient } from '@pipecat-ai/client-react';

interface TranscriptEntry {
  text: string;
  final: boolean;
  timestamp: string;
  user_id: string;
  role: 'bot' | 'user';
}

interface TranscriptPanelProps {
  transcripts: TranscriptEntry[];
}

export default function TranscriptPanel({ transcripts }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div className="bg-background rounded-lg shadow-lg flex w-full flex-col border">
      <h3 className="p-4 text-lg font-semibold text-gray-800 border-b">
        Transcript
      </h3>
      <div className="overflow-hidden" ref={scrollRef}>
        <div className="space-y-4 p-4">
          {!transcripts ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-gray-600">Error fetching transcript</p>
            </div>
          ) : transcripts.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-gray-600">No transcript available</p>
            </div>
          ) : (
            transcripts.map((entry, index) => {
              // Skip duplicate consecutive messages
              if (index > 0 && 
                  entry.role === transcripts[index - 1].role && 
                  entry.text === transcripts[index - 1].text) {
                return null;
              }
              
              return (
                <div key={`${entry.timestamp}-${index}`} className="flex items-start space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={entry.role === 'bot' ? '/placeholder-avatar.jpg' : '/placeholder.svg'}
                      alt={entry.role === 'bot' ? 'AI' : 'You'}
                    />
                    <AvatarFallback>
                      {entry.role === 'bot' ? 'AI' : 'You'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-gray-100 p-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {entry.role === 'bot' ? 'AI' : 'You'}
                    </p>
                    <p className="text-sm text-gray-600">{entry.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
