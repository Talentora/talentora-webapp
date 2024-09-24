import { useCallback, useRef } from "react";
import Image from "next/image";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import FaceSVG from "./face.svg";

export const Avatar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.RemoteAudioLevel,
    useCallback((volume: number) => {
      if (!volRef.current) return;
      volRef.current.style.transform = `scale(${Math.max(1, 1 + volume)})`;
    }, [])
  );

  return (
    <>
      <Image src={FaceSVG} alt="Face" className="relative z-20 animate-[faceAppear_1s_ease-out_forwards]" />
      <div
        className="absolute w-[220px] h-[220px] rounded-full z-10 bg-primary-700 transition-transform duration-100 ease"
        ref={volRef}
      />
    </>
  );
};

export default Avatar;
