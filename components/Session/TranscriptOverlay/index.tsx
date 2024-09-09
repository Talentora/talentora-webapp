import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';

const TranscriptOverlay: React.FC = () => {
  const [sentences, setSentences] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
      if (sentences.length > 2) {
        setSentences((s) => s.slice(1));
      }
    }, 2500);

    return () => clearInterval(intervalRef.current!);
  }, [sentences]);

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((transcript) => {
      setSentences((s) => [...s, transcript]);
    }, [])
  );

  return (
    <div className="absolute left-4 right-4 bottom-6 top-6 text-white z-50 mx-auto flex flex-col gap-2 items-center justify-end text-center">
      {sentences.map((sentence, index) => (
        <abbr
          key={index}
          className="font-semibold text-sm max-w-xs opacity-1 m-0 line-height[2] animate-fadeOut"
          style={{
            animation: 'fadeOut 2.5s linear forwards',
            animationDelay: '1s'
          }}
        >
          <span className="box-decoration-clone bg-primary-800/70 rounded-md px-2 py-1">
            {sentence}
          </span>
        </abbr>
      ))}
    </div>
  );
};

export default TranscriptOverlay;
