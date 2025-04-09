'use client';

import React from 'react';
import {
  ControlBar,
  TrackToggle,
  DisconnectButton,
  MediaDeviceMenu,
  RoomAudioRenderer
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import AudioVisualizer from './AudioVisualizer';
import VideoGrid from './VideoGrid';
import ConnectionToasts from './ConnectionToasts';
import TranscriptContainer from './TranscriptContainer';

interface VideoInterviewSessionProps {
  onLeave: () => void;
}

export default function VideoInterviewSession({ onLeave }: VideoInterviewSessionProps) {
  return (
    <div className="flex flex-col h-full relative">
      <RoomAudioRenderer />
      
      {/* Position ConnectionToasts with high z-index to ensure visibility */}
     
      <main className="flex-1">
        <div className="h-1/3 flex flex-row gap-4">
          {/* Left panel: Visualizer and Transcript */}
          <div className="w-1/3 flex flex-col gap-4">
            <AudioVisualizer />
            <TranscriptContainer />
          </div>

          {/* Right panel: Video Grid */}
          <VideoGrid />
        </div>
      </main>
      
      <footer className="p-4 bg-background border-t">
        <ControlBar saveUserChoices={true} variation="minimal">
          <TrackToggle source={Track.Source.Microphone} />
          <TrackToggle source={Track.Source.Camera} />
          <MediaDeviceMenu />
          <DisconnectButton onClick={onLeave} />
        </ControlBar>
      </footer>
    </div>
  );
}
