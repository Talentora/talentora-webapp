import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';

const TranscriptOverlay: React.FC = () => {
  const [sentences, setSentences] = useState<string[]>([]);
  const [sentencesBuffer, setSentencesBuffer] = useState<string[]>([]);
  const displayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((text: string) => {
      setSentencesBuffer((s) => [...s, text.trim()]);
    }, [])
  );

  useEffect(() => {
    if (sentencesBuffer.length > 0) {
      const interval = 1000 * sentences.length;
      displayIntervalRef.current = setTimeout(() => {
        setSentences((s) => [...s, sentencesBuffer[0]]);
        setSentencesBuffer((s) => s.slice(1));
      }, interval);
    }
    return () => {
      if (displayIntervalRef.current) {
        clearInterval(displayIntervalRef.current);
      }
    };
  }, [sentencesBuffer, sentences]);

  return (
    <div className="absolute left-4 right-4 bottom-6 top-6 text-white z-50 mx-auto flex flex-col gap-2 items-center justify-end text-center">
      {sentences.map((sentence, index) => (
        <abbr
          key={index}
          className="font-semibold text-sm max-w-xs opacity-1 m-0 animate-fadeOut"
          onAnimationEnd={() => setSentences((s) => s.slice(1))}
        >
          <span className="box-decoration-clone bg-primary-800/30 rounded-md px-2 py-1 leading-none">
            {sentence}
          </span>
        </abbr>
      ))}
    </div>
  );
};

export default TranscriptOverlay;
