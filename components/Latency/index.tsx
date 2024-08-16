import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientMediaTrack, useVoiceClientEvent } from "realtime-ai-react";
// Removed static import for VAD and AudioWorkletURL
import clsx from "clsx";

import {
  LATENCY_MAX,
  LATENCY_MIN,
  VAD_MIN_SPEECH_FRAMES,
  VAD_NEGATIVE_SPEECH_THRESHOLD,
  VAD_POSITIVE_SPEECH_THRESHOLD,
  VAD_PRESPEECH_PAD_FRAMES,
  VAD_REDEMPTION_FRAMES,
} from "@/utils/config";

import { calculateMedian } from "./utils";
import StatsAggregator from "@/utils/stats_aggregator";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const REMOTE_AUDIO_THRESHOLD = 0;

const Latency: React.FC<{
  started: boolean;
  botStatus: string;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ started = false, botStatus, statsAggregator }) => {
    const localMediaTrack = useVoiceClientMediaTrack("audio", "local");
    const [vadInstance, setVadInstance] = useState<any | null>(null);
    const [currentState, setCurrentState] = useState<State>(State.SILENT);
    const [botTalkingState, setBotTalkingState] = useState<State | undefined>(
      undefined
    );
    const [lastDelta, setLastDelta] = useState<number | null>(null);
    const [median, setMedian] = useState<number | null>(null);
    const [hasSpokenOnce, setHasSpokenOnce] = useState<boolean>(false);

    const deltaRef = useRef<number>(0);
    const deltaArrayRef = useRef<number[]>([]);
    const startTimeRef = useRef<Date | null>(null);
    const mountedRef = useRef<boolean>(false);

    /* ---- Timer actions ---- */
    const startTimer = useCallback(() => {
      startTimeRef.current = new Date();
    }, []);

    const stopTimer = useCallback(() => {
      if (!startTimeRef.current) {
        return;
      }

      const now = new Date();
      const diff = now.getTime() - startTimeRef.current.getTime();

      if (diff < LATENCY_MIN || diff > LATENCY_MAX) {
        startTimeRef.current = null;
        return;
      }

      deltaArrayRef.current = [...deltaArrayRef.current, diff];
      setMedian(calculateMedian(deltaArrayRef.current));
      setLastDelta(diff);
      startTimeRef.current = null;

      if (statsAggregator) {
        statsAggregator.turns++;
      }
    }, [statsAggregator]);

    useVoiceClientEvent(
      VoiceEvent.RemoteAudioLevel,
      useCallback(
        (volume) => {
          if (volume > REMOTE_AUDIO_THRESHOLD && startTimeRef.current) {
            stopTimer();
          }
        },
        [stopTimer]
      )
    );

    useVoiceClientEvent(
      VoiceEvent.BotStoppedTalking,
      useCallback(() => {
        setBotTalkingState(State.SILENT);
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.BotStartedTalking,
      useCallback(() => {
        setBotTalkingState(State.SPEAKING);
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.LocalStartedTalking,
      useCallback(() => {
        if (!hasSpokenOnce) {
          setHasSpokenOnce(true);
        }
      }, [hasSpokenOnce])
    );

    useEffect(() => {
      startTimeRef.current = null;
      deltaRef.current = 0;
      deltaArrayRef.current = [];
      setVadInstance(null);
      setHasSpokenOnce(false);
    }, []);

    useEffect(() => {
      if (
        !started ||
        !hasSpokenOnce ||
        !vadInstance ||
        vadInstance.state !== "listening" ||
        currentState !== State.SILENT
      ) {
        return;
      }
      startTimer();
    }, [started, vadInstance, currentState, startTimer, hasSpokenOnce]);

    useEffect(() => {
      if (mountedRef.current || !localMediaTrack) {
        return;
      }

      async function loadVad() {
        try {
          if (typeof window.AudioContext === "undefined" || typeof window.AudioWorkletNode === "undefined") {
            console.error("AudioWorkletProcessor or AudioContext is not supported in this environment.");
            return;
          }

          const { VAD, VADState } = await import("web-vad");
          const AudioWorkletURL = (await import("web-vad/dist/worklet?worker&url")).default;

          const stream = new MediaStream([localMediaTrack!]);

          const vad = new VAD({
            workletURL: AudioWorkletURL,
            stream,
            positiveSpeechThreshold: VAD_POSITIVE_SPEECH_THRESHOLD,
            negativeSpeechThreshold: VAD_NEGATIVE_SPEECH_THRESHOLD,
            minSpeechFrames: VAD_MIN_SPEECH_FRAMES,
            redemptionFrames: VAD_REDEMPTION_FRAMES,
            preSpeechPadFrames: VAD_PRESPEECH_PAD_FRAMES,
            onSpeechStart: () => {
              setCurrentState(State.SPEAKING);
            },
            onVADMisfire: () => {
              setCurrentState(State.SILENT);
            },
            onSpeechEnd: () => {
              setCurrentState(State.SILENT);
            },
          });
          await vad.init();
          vad.start();
          setVadInstance(vad);
        } catch (error) {
          console.error("Error initializing VAD:", error);
        }
      }

      if (typeof window !== 'undefined') {
        loadVad().catch(error => {
          console.error("Error in loadVad:", error);
        });
      }

      mountedRef.current = true;
    }, [localMediaTrack]);

    useEffect(
      () => () => {
        if (vadInstance && vadInstance.state !== "destroyed") {
          setVadInstance(null);
          vadInstance?.destroy();
        }
      },
      [vadInstance]
    );

    const userCx = clsx(
      "flex flex-col bg-white p-2 md:p-3 rounded-2xl transition-all duration-200",
      currentState === State.SPEAKING && "border-emerald-300 bg-emerald-50 shadow-lg"
    );

    const botCx = clsx(
      "flex flex-col bg-white p-2 md:p-3 rounded-2xl transition-all duration-200",
      botTalkingState === State.SPEAKING && "border-emerald-300 bg-emerald-50 shadow-lg"
    );

    const userStatusCx = clsx(
      "mx-auto self-start bg-sky-100 rounded-md text-xs font-bold px-1 py-2 text-sky-700 capitalize",
      currentState === State.SPEAKING && "bg-emerald-100 text-emerald-700"
    );

    const botStatusCx = clsx(
      "mx-auto self-start bg-sky-100 rounded-md text-xs font-bold px-1 py-2 text-sky-700 capitalize",
      botStatus === "initializing" && "bg-orange-100 text-orange-700",
      botStatus === "disconnected" && "bg-red-100 text-red-700",
      botTalkingState === State.SPEAKING && "bg-emerald-100 text-emerald-700"
    );

    return (
      <div className="w-full flex flex-row p-2">
        <div className={started ? userCx : "flex flex-col bg-white p-2 md:p-3 rounded-2xl"}>
          <span className="font-mono text-xs uppercase tracking-wider">
            User <span className="hidden md:inline">status</span>
          </span>
          <span className={started ? userStatusCx : "mx-auto self-start bg-sky-100 rounded-md text-xs font-bold px-1 py-2 text-sky-700 capitalize"}>
            {started && currentState === State.SPEAKING ? "Speaking" : "Connected"}
          </span>
        </div>
        <div className="flex flex-col w-20 mx-auto p-0 bg-white">
          <span className="font-mono text-xs uppercase tracking-wider">
            Latency
          </span>
          <span className="font-bold text-sm">
            {lastDelta || "---"}<sub>ms</sub>
          </span>
          <span className="text-gray-400 text-xs">
            avg {median?.toFixed() || "0"}<sub>ms</sub>
          </span>
        </div>
        <div className={botCx}>
          <span className="font-mono text-xs uppercase tracking-wider">
            Bot <span className="hidden md:inline">status</span>
          </span>
          <span className={botStatusCx}>
            {botStatus === "disconnected" ? "Disconnected" : botTalkingState === State.SPEAKING ? "Speaking" : botStatus}
          </span>
        </div>
      </div>
    );
  },
  (prevState, nextState) =>
    prevState.started === nextState.started &&
    prevState.botStatus === nextState.botStatus
);

export default Latency;
