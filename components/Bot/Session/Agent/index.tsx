import React, { memo, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent, VoiceClientVideo } from "realtime-ai-react";

import WaveForm from "./waveform";

const Agent: React.FC<{ isReady: boolean }> = memo(({ isReady }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [botStatus, setBotStatus] = useState<"initializing" | "connected" | "disconnected">("initializing");
  const [botIsTalking, setBotIsTalking] = useState(false);

  useEffect(() => {
    if (isReady) {
      setHasStarted(true);
      setBotStatus("connected");
    }
  }, [isReady]);

  useVoiceClientEvent(VoiceEvent.BotDisconnected, useCallback(() => {
    setHasStarted(false);
    setBotStatus("disconnected");
  }, []));

  useVoiceClientEvent(VoiceEvent.BotStartedSpeaking, useCallback(() => {
    setBotIsTalking(true);
  }, []));

  useVoiceClientEvent(VoiceEvent.BotStoppedSpeaking, useCallback(() => {
    setBotIsTalking(false);
  }, []));

  useEffect(() => () => setHasStarted(false), []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className={`relative flex flex-col items-center justify-center w-full h-full border-2 border-solid rounded-lg ${hasStarted ? "border-light" : "border-foreground"} ${botIsTalking ? "bg-green-100" : "bg-white"}`}>
        {!hasStarted ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-gray-500" />
          </span>
        ) : (
          <WaveForm />
        )}
      </div>
      <VoiceClientVideo
          participant="local"
          mirror={true}
        />
    </div>
  );
}, (prevProps, nextProps) => prevProps.isReady === nextProps.isReady);

Agent.displayName = "Agent";

export default Agent;
