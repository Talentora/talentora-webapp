import React, { useCallback, useEffect, useRef, useState } from "react";
import { LogOut, StopCircle } from "lucide-react";
import { TransportState, VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

import StatsAggregator from "@/utils/stats_aggregator";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UserMicBubble from "@/components/UserMicBubble";

import Agent from "./Agent";

let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const Session = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    const voiceClient = useVoiceClient()!;
    const [hasStarted, setHasStarted] = useState(false);
    const [muted, setMuted] = useState(startAudioOff);
    const modalRef = useRef<HTMLDialogElement>(null);
    const [showDevices, setShowDevices] = useState(false);


    // ---- Voice Client Events

    // Wait for the bot to enter a ready state and trigger it to say hello
    useVoiceClientEvent(
      VoiceEvent.BotReady,
      useCallback(() => {
        voiceClient.appendLLMContext({
          role: "assistant",
          content: "Greet the user",
        });
      }, [voiceClient])
    );

    useVoiceClientEvent(
      VoiceEvent.Metrics,
      useCallback((metrics) => {
        metrics?.ttfb?.map((m: { processor: string; value: number }) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.BotStoppedTalking,
      useCallback(() => {
        if (hasStarted) return;

        setHasStarted(true);
      }, [hasStarted])
    );

    // ---- Effects

    useEffect(() => {
      // Reset started state on mount
      setHasStarted(false);
    }, []);

    useEffect(() => {
      // If we joined unmuted, enable the mic once in ready state
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);

    useEffect(() => {
      // Create new stats aggregator on mount (removes stats from previous session)
      stats_aggregator = new StatsAggregator();
    }, []);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showDevices) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showDevices]);

    function toggleMute() {
      voiceClient.enableMic(muted);
      setMuted(!muted);
    }

    return (
      <>
        <div className="">
          <Card.Card
            fullWidthMobile={false}
            className="w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-long"
          >
            <Agent
              isReady={state === "ready"}
              statsAggregator={stat}
            />
          </Card.Card>
          <UserMicBubble
            active={hasStarted}
            muted={muted}
            handleMute={() => toggleMute()}
          />
        </div>

        <footer className="w-full flex flex-row mt-auto self-end md:w-auto">
          <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
            <Tooltip>
              <TooltipContent>Interrupt bot</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => voiceClient.interrupt()}
                >
                  <StopCircle />
                </Button>
              </TooltipTrigger>
            </Tooltip>
              <Button onClick={() => onLeave()} className="ml-auto">
              <LogOut size={16} />
              End
            </Button>
          </div>
        </footer>
      </>
    );
  },
  (p, n) => p.state === n.state
);

export default Session;
