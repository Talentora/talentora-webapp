import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Mic, MicOff, Pause } from 'lucide-react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClientEvent } from 'realtime-ai-react';

/**
 * AudioIndicatorBubble component
 * This component visually indicates the audio level by scaling a div element.
 */
const AudioIndicatorBubble: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        volRef.current.style.transform = `scale(${Math.max(0.1, volume * 1.75)})`;
      }
    }, [])
  );

  return (
    <div
      ref={volRef}
      className="absolute inset-0 z-0 rounded-full transition-transform duration-100 ease transform scale-0 opacity-50 bg-green-300"
    />
  );
};

/**
 * Props interface for UserMicBubble component
 */
interface Props {
  active: boolean;
  muted: boolean;
  handleMute: () => void;
}

/**
 * UserMicBubble component
 * This component represents a microphone bubble that indicates whether the user can talk or is muted.
 * It also includes an audio level indicator when the user is talking.
 */
export default function UserMicBubble({ active, muted, handleMute }: Props) {
  const canTalk = !muted && active;

  const cx = clsx(
    muted &&
      active &&
      'opacity-100 bg-red-500 animate-pulseText border-6 border-red-200 outline-6 outline-red-400',
    !active && 'pointer-events-none cursor-not-allowed',
    canTalk &&
      'opacity-100 bg-primary-500 border-6 border-primary-200 outline-6 outline-primary-400 outline-offset-4'
  );

  return (
    <div className="relative z-20 flex flex-col mx-auto pt-5 md:pt-0">
      <div
        className={`relative cursor-pointer w-24 h-24 rounded-full flex justify-center items-center mx-auto z-20 transition-all duration-500 ease opacity-50 border-6 border-primary-300 outline-6 outline-primary-300 ${cx}`}
        onClick={handleMute}
      >
        <div className="relative z-20 opacity-30 transition-opacity duration-500 ease leading-none">
          {!active ? (
            <Pause size={42} />
          ) : canTalk ? (
            <Mic size={42} />
          ) : (
            <MicOff size={42} />
          )}
        </div>
        {canTalk && <AudioIndicatorBubble />}
      </div>
    </div>
  );
}
