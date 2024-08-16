import React, { memo, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";
// import Latency from "@/components/Latency";
import Avatar from "./avatar";
import ModelBadge from "./model";
import dynamic from 'next/dynamic'

const Latency = dynamic(() => import('@/components/Latency'), { ssr: false })


export const Agent: React.FC<{
  isReady: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ isReady, statsAggregator }) => {
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");

    useEffect(() => {
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

    useEffect(() => () => setHasStarted(false), []);

    const agentWindowClass = clsx(
      "relative flex items-center justify-center min-w-[400px] bg-primary-300 rounded-2xl transition-colors duration-[2.5s] overflow-hidden aspect-square",
      hasStarted && "bg-primary-600"
    );

    return (
      <div className="relative p-2">
        <div className={agentWindowClass}>
          <ModelBadge />
          {!hasStarted ? (
            <span className="absolute p-3 inline-block bg-primary-600 text-white rounded-full">
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <Avatar />
          )}
        </div>
        <footer className="flex justify-between w-full mt-4">
          <Latency
            started={hasStarted}
            botStatus={botStatus}
            statsAggregator={statsAggregator}
          />
        </footer>
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);

export default Agent;
