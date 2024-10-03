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

interface ControlPanelProps {
  isMuted: boolean;
  isCameraOn: boolean;
  isAudioEnabled: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
  onAudioToggle: () => void;
  onLeave: () => void;
}

export default function ControlPanel({
  isMuted,
  isCameraOn,
  isAudioEnabled,
  onMicToggle,
  onCameraToggle,
  onAudioToggle,
  onLeave
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
            {isMuted ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {isMuted ? 'Unmute' : 'Mute'} Mic
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
          <Button
            size="sm"
            variant="outline"
            className={`${!isAudioEnabled ? 'bg-red-100 hover:bg-red-200' : ''}`}
            onClick={onAudioToggle}
          >
            {isAudioEnabled ? (
              <Volume2 className="mr-2 h-4 w-4" />
            ) : (
              <VolumeX className="mr-2 h-4 w-4" />
            )}
            {isAudioEnabled ? 'Mute' : 'Unmute'} Audio
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
