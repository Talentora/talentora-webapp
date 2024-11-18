import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RTVIClient, TranscriptData, RTVIEvent } from 'realtime-ai';
import { useRTVIClient } from 'realtime-ai-react';
import { useRTVIClientEvent } from 'realtime-ai-react';

interface TranscriptPanelProps {
  transcript: {
    role: 'bot' | 'user';
    text: string;
  }[];
}

export default function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    console.log("Transcript", transcript);
  }, [transcript]);


  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden h-1/2">
      <h3 className="p-4 text-lg font-semibold text-gray-800 border-b">
        Transcript
      </h3>
      <ScrollArea  >
        <div className="space-y-4 p-4" ref={scrollRef}>
          
          {transcript.map((entry, index, arr) => {
            // Skip if this message is identical to the previous one
            if (index > 0 && 
                entry.role === arr[index-1].role && 
                entry.text === arr[index-1].text) {
              return null;
            }
            
            return (
              <div key={index} className="flex items-start space-x-2">
                <Avatar>
                  <AvatarImage
                    src={
                      entry.role === 'bot'
                        ? '/placeholder-avatar.jpg'
                        : '/placeholder.svg'
                    }
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
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
