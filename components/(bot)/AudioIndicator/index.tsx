import { useCallback, useRef } from 'react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';

export const AudioIndicatorBar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        volRef.current.style.width = Math.max(2, volume * 100) + '%';
      }
    }, [])
  );

  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        ref={volRef}
        className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-width duration-100 ease-linear"
      />
    </div>
  );
};

export default AudioIndicatorBar;
