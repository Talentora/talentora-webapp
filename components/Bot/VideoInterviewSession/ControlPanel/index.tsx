import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  LogOut
} from 'lucide-react';
import { useRTVIClientMediaDevices, useRTVIClient, VoiceVisualizer } from "@pipecat-ai/client-react";

interface ControlPanelProps {
  onLeave: () => void;
}

export default function ControlPanel({ onLeave }: ControlPanelProps) {
  const client = useRTVIClient();
  const { selectedMic, selectedCam, updateMic, updateCam } = useRTVIClientMediaDevices();

  const toggleMic = () => {
    if (client) {
      client.enableMic(!client.isMicEnabled);
    }
  };

  const toggleCamera = () => {
    if (selectedCam && client) {
      client.enableCam(!client.isCamEnabled);
    }
  };

  return (
    <footer className="p-4 shadow-t">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex space-x-2 items-center">
          <div className="relative">
            <Button
              variant="outline"
              className={`${!client?.isMicEnabled ? 'bg-red-100 hover:bg-red-200' : ''}`}
              onClick={toggleMic}
            >
              {client?.isMicEnabled ? (
                <Mic className="mr-2 h-4 w-4" />
              ) : (
                <MicOff className="mr-2 h-4 w-4" />
              )}
              {client?.isMicEnabled ? 'Mute' : 'Unmute'} Mic
            </Button>
            {/* Subtle voice visualizer overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden opacity-50">
              <VoiceVisualizer
                participantType="local"
                backgroundColor="transparent"
                barColor="black"
                barGap={2}
                barWidth={3}
                barMaxHeight={4}
              />
            </div>
          </div>
          <Button
            variant="outline"
            className={`${!client?.isCamEnabled ? 'bg-red-100 hover:bg-red-200' : ''}`}
            onClick={toggleCamera}
          >
            {client?.isCamEnabled ? (
              <Camera className="mr-2 h-4 w-4" />
            ) : (
              <CameraOff className="mr-2 h-4 w-4" />
            )}
            {client?.isCamEnabled ? 'Turn Off' : 'Turn On'} Camera
          </Button>
        </div>
        <Button variant="destructive" onClick={onLeave}>
          <LogOut className="mr-2 h-4 w-4" />
          End Interview
        </Button>
      </div>
    </footer>
  );
}
