import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  LogOut
} from 'lucide-react';
import { useRTVIClient } from 'realtime-ai-react';

interface ControlPanelProps {
  onLeave: () => void;
  isMuted: boolean;
  isCameraOn: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
}

export default function ControlPanel({
  onLeave,
  isMuted,
  isCameraOn,
  onMicToggle,
  onCameraToggle,
}: ControlPanelProps) {



  return (
    <footer className="p-4 shadow-t">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className={`${isMuted ? 'bg-red-100 hover:bg-red-200' : ''}`}
            onClick={onMicToggle}
          >
            {!isMuted ? (
              <Mic className="mr-2 h-4 w-4" />
            ) : (
              <MicOff className="mr-2 h-4 w-4" />
            )}
            {!isMuted ? 'Mute' : 'Unmute'} Mic
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`${!isCameraOn ? 'bg-red-100 hover:bg-red-200' : ''}`}
            onClick={onCameraToggle}
          >
            {isCameraOn ? (
              <Camera className="mr-2 h-4 w-4" />
            ) : (
              <CameraOff className="mr-2 h-4 w-4" />
            )}
            {isCameraOn ? 'Turn Off' : 'Turn On'} Camera
          </Button>
        
        </div>
        <Button size="sm" variant="destructive" onClick={onLeave}>
          <LogOut className="mr-2 h-4 w-4" />
          End Interview
        </Button>
      </div>
    </footer>
  );
}
