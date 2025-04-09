'use client';

import React from 'react';
import {
  GridLayout,
  ParticipantTile,
  useTracks,
  ControlBar,
  TrackToggle,
  DisconnectButton,
  MediaDeviceMenu,
  Toast,
  ConnectionStateToast,
  useConnectionState,
  BarVisualizer,
  useVoiceAssistant,
  useTrackTranscription,
  RoomAudioRenderer
} from '@livekit/components-react';
import { Track, ConnectionState, TrackPublication } from 'livekit-client';
import { useBotContext } from '@/components/Bot/BotContext';
import Transcript from './Transcript';

interface DisplayTranscriptionSegment {
  id: string;
  text: string;
  startTime?: number;
  endTime?: number;
  final: boolean;
  participantIdentity?: string;
}

interface VideoInterviewSessionProps {
  onLeave: () => void;
}

export default function VideoInterviewSession({ onLeave }: VideoInterviewSessionProps) {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const connectionState = useConnectionState();
  const { state, audioTrack } = useVoiceAssistant();
  


  return (
    <div className="flex flex-col h-screen relative">
      <RoomAudioRenderer />
      
      <div>
        {/* Connection state toast */}
        <div className="absolute top-4 right-4 z-50">
          <ConnectionStateToast />
        </div>

        {/* Custom status messages */}
        {connectionState === ConnectionState.Connecting && (
          <div className="absolute top-16 right-4 z-50">
            <Toast>Connecting to interview...</Toast>
          </div>
        )}
        {connectionState === ConnectionState.Reconnecting && (
          <div className="absolute top-16 right-4 z-50">
            <Toast>Connection lost. Trying to reconnect...</Toast>
          </div>
        )}
        {connectionState === ConnectionState.Disconnected && (
          <div className="absolute top-16 right-4 z-50">
            <Toast>Disconnected from interview</Toast>
          </div>
        )}
      </div>
      <main className="flex-1 p-4">
        <div className="flex flex-row gap-4 h-full">
          {/* Left panel: Visualizer and Transcript */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="h-32 border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Audio Level</h3>
              <BarVisualizer 
                state={state} 
                trackRef={audioTrack}
                barCount={10}
              />
            </div>
            <div className="flex-1 border rounded-lg bg-white shadow-sm overflow-hidden" style={{ maxHeight: "305h" }}>
              {/* Container div for sticky header and scrollable content */}
              <div className="h-full flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 p-4 border-b sticky top-0 bg-white z-10">Transcript</h3>
                <div className="flex-1 overflow-y-auto">
                  <Transcript />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Video Grid */}
          <div className="w-2/3 border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
            <div className="h-full">
              <GridLayout tracks={tracks} className="h-full">
                <ParticipantTile style={{ width: "auto", height: "auto" }} />
              </GridLayout>
              
            </div>
          </div>
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
