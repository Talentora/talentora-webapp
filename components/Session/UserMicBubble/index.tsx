import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Mic, MicOff, Pause } from 'lucide-react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';

const AudioIndicatorBubble: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        const v = Number(volume) * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );

  return (
    <div
      ref={volRef}
      className="absolute inset-0 z-0 overflow-hidden rounded-full transition-transform duration-100 ease-transform scale-0 opacity-50 bg-green-300"
    />
  );
};

interface Props {
  active: boolean;
  muted: boolean;
  handleMute: () => void;
}

export default function UserMicBubble({
  active,
  muted = false,
  handleMute
}: Props) {
  const canTalk = !muted && active;

  const cx = clsx(
    muted &&
      active &&
      'opacity-100 bg-red-500 bg-radial-gradient-red-500-red-600 animate-pulse border-red-200 outline-red-400',
    !active && 'pointer-events-none cursor-not-allowed',
    canTalk &&
      'opacity-100 bg-primary-500 bg-radial-gradient-primary-500-primary-600 border-primary-200 outline-primary-400 outline-offset-4'
  );

  return (
    <div className="relative z-20 flex flex-col mx-auto pt-5 md:pt-0 text-white">
      <div
        className={`relative cursor-pointer box-border w-24 h-24 rounded-full flex justify-center items-center mx-auto z-20 transition-all duration-500 ease opacity-50 border-6 border-primary-300 outline-6 outline-primary-300 outline-offset-0 bg-primary-500 bg-radial-gradient-primary-300-primary-400 md:w-30 md:h-30 md:rounded-full ${cx}`}
        onClick={() => handleMute()}
      >
        <div className="relative z-20 opacity-30 transition-opacity duration-500 ease leading-none">
          {!active ? (
            <Pause size={42} className="size-8 md:size-10" />
          ) : canTalk ? (
            <Mic size={42} className="size-8 md:size-10" />
          ) : (
            <MicOff size={42} className="size-8 md:size-10" />
          )}
        </div>
        {canTalk && <AudioIndicatorBubble />}
      </div>
    </div>
  );
}
