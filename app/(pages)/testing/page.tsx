import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LineChart, LogOut, Settings, StopCircle } from "lucide-react";
import { PipecatMetrics, TransportState, VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

import StatsAggregator from "@/utils/stats_aggregator";
import { Configure } from "../Setup";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import Agent from "@/components/Bot/Session/Agent";
import Stats from "./Stats";
import UserMicBubble from "./UserMicBubble";

const Page = () => {

    return (
        <div>
        <footer className="w-full flex flex-row mt-auto self-end md:w-auto">
        <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
          <Tooltip>
            <TooltipContent>Interrupt bot</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  voiceClient.sendAction({
                    service: "tts",
                    action: "interrupt",
                    arguments: [],
                  });
                }}
              >
                <StopCircle />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipContent>Show bot statistics panel</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant={showStats ? "ghost" : "ghost"}
                size="icon"
                onClick={() => setShowStats(!showStats)}
              >
                <LineChart />
              </Button>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipContent>Configure</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDevices(true)}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
          </Tooltip>
          <Button onClick={() => onLeave()} className="ml-auto">
            <LogOut size={16} />
            End
          </Button>
        </div>
      </footer>
        </div>
    )
}


export default Page;