import React, { memo, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent, VoiceClientProvider } from "realtime-ai-react";

import ModelBadge from "./model";
import WaveForm from "./waveform";

export const Agent: React.FC<{
  isReady: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ isReady, statsAggregator }) => {
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");
    const [botIsTalking, setBotIsTalking] = useState<boolean>(false);

    useEffect(() => {
      // Update the started state when the transport enters the ready state
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    useVoiceClientEvent(
      VoiceEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.BotStartedTalking,
      useCallback(() => {
        setBotIsTalking(true);
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.BotStoppedTalking,
      useCallback(() => {
        setBotIsTalking(false);
      }, [])
    );

    // Cleanup
    useEffect(() => () => setHasStarted(false), []);

    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg ${
            hasStarted ? "border-green-500" : "border-gray-500"
          } ${botIsTalking ? "bg-green-100" : "bg-white"}`}
        >
          <ModelBadge />
          {!hasStarted ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-gray-500" />
            </span>
          ) : (
            <WaveForm />
          )}
        </div>
        <VoiceClientProvider
          participant="local"
          mirror={true}
          className="w-full h-full mt-4 rounded-lg"
        />
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);
Agent.displayName = "Agent";

export default Agent;
