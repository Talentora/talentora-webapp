import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  LogOut
} from 'lucide-react';
import { useRTVIClientMediaDevices, useRTVIClient, VoiceVisualizer } from "@pipecat-ai/client-react";
import InterviewTimer from '../InterviewTimer';

interface ControlPanelProps {
  onLeave: () => void;
  onTimeUp: () => void;
}

export default function ControlPanel({ onLeave, onTimeUp }: ControlPanelProps) {
  const client = useRTVIClient();
  const { selectedMic, selectedCam, updateMic, updateCam } = useRTVIClientMediaDevices();
  const [isMicMuted, setIsMicMuted] = useState(client?.isMicEnabled);
  const [isCamOff, setIsCamOff] = useState(client?.isCamEnabled);

  const toggleMic = () => {
    if (client) {
      client.enableMic(!client.isMicEnabled);
      setIsMicMuted(!client.isMicEnabled);
    }
    setIsMicMuted(client?.isMicEnabled);
  };

  const toggleCamera = () => {
    if (selectedCam && client) {
      client.enableCam(!client.isCamEnabled);
      setIsCamOff(!client.isCamEnabled);
    }
  };

  return (
    <footer className="p-4 shadow-t">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <Button
              variant="outline"
              className={`${isMicMuted ? 'bg-red-100 hover:bg-red-200' : ''}`}
              onClick={toggleMic}
            >
              {isMicMuted ? (
                <MicOff className="mr-2 h-4 w-4" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {isMicMuted ? 'Unmute' : 'Mute'} Mic
            </Button>
            {/* Subtle voice visualizer overlay */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden opacity-50">
              <VoiceVisualizer
                participantType="local"
                backgroundColor="transparent"
                barColor="black"
                barGap={2}
                barWidth={3}
                barMaxHeight={4}
              />
            </div> */}
          </div>
          <Button
            variant="outline"
            className={`${!isCamOff ? 'bg-red-100 hover:bg-red-200' : ''}`}
            onClick={toggleCamera}
          >
            {!isCamOff ? (
              <CameraOff className="mr-2 h-4 w-4" />
            ) : (
              <Camera className="mr-2 h-4 w-4" />
            )}
            {!isCamOff ? 'Turn On' : 'Turn Off'} Camera
          </Button>
          <InterviewTimer onTimeUp={onTimeUp} />
        </div>
        <Button variant="destructive" onClick={onLeave}>
          <LogOut className="mr-2 h-4 w-4" />
          End Interview
        </Button>
      </div>
    </footer>
  );
}
