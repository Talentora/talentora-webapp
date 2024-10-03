import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TranscriptPanelProps {
  transcript: { speaker: string; text: string }[];
}

export default function TranscriptPanel({ transcript }: TranscriptPanelProps) {

  

  return (
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
        <h3 className="p-4 text-lg font-semibold text-gray-800 border-b">
          Transcript
        </h3>
        <ScrollArea className="flex-grow">
          <div className="space-y-4 p-4">
            {transcript.map((entry, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Avatar>
                  <AvatarImage
                    src={
                      entry.speaker === 'AI'
                        ? '/placeholder-avatar.jpg'
                        : '/placeholder.svg'
                    }
                    alt={entry.speaker}
                  />
                  <AvatarFallback>
                    {entry.speaker === 'AI' ? 'AI' : 'You'}
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-gray-100 p-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {entry.speaker}
                  </p>
                  <p className="text-sm text-gray-600">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
}
