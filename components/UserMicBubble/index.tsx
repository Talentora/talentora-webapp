import { Mic, MicOff, Pause } from "lucide-react";
import clsx from "clsx";

interface Props {
  active: boolean;
  muted: boolean;
  handleMute: () => void;
}

import React, { useCallback, useRef } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

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
      className="absolute inset-0 z-0 rounded-full transition-transform duration-100 ease-in-out bg-green-300 opacity-50 transform scale-0"
    />
  );
};


export default function UserMicBubble({
                                        active,
                                        muted = false,
                                        handleMute,
                                      }: Props) {
  const canTalk = !muted && active;

  const bubbleClass = clsx(
    "relative cursor-pointer box-border w-24 h-24 md:w-30 md:h-30 rounded-full flex justify-center items-center mx-auto transition-all duration-500 ease-in-out",
    {
      "bg-red-500 bg-gradient-to-br from-red-500 to-red-600 animate-pulse border-6 border-red-200 outline-6 outline-red-400":
      muted,
      "bg-primary-500 bg-gradient-to-br from-primary-300 to-primary-400 border-6 outline-6 opacity-50":
        !canTalk,
      "bg-primary-500 bg-gradient-to-br from-primary-500 to-primary-600 border-6 border-primary-200 outline-6 outline-primary-400":
      canTalk,
    }
  );

  const iconClass = clsx("relative z-20 transition-opacity duration-500", {
    "opacity-30": !canTalk,
    "opacity-100": canTalk,
  });

  return (
    <div className="relative z-20 flex flex-col mx-auto pt-5 md:pt-0">
      <div className={bubbleClass} onClick={handleMute}>
        <div className={iconClass}>
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
