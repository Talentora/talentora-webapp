import { useCallback, useRef } from 'react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';
import FaceSVG from './face.svg';

export const Avatar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.RemoteAudioLevel,
    useCallback((volume) => {
      if (!volRef.current) return;
      volRef.current.style.transform = `scale(${Math.max(1, 1 + volume)})`;
    }, [])
  );

  return (
    <div className="relative z-2">
      <img src={FaceSVG} alt="Face" className="animate-faceAppear" />
      <div
        className="absolute w-[220px] h-[220px] rounded-full bg-primary-700 transition-transform duration-100 ease z-1"
        ref={volRef}
      />
    </div>
  );
};

export default Avatar;
