import React from 'react';
import { VideoTrack, useTracks, useIsRecording, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function VideoGrid() {
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const isRecording = useIsRecording();

  // Find the local participant's camera track
  const localCameraTrack = tracks.find(
    (track) => track.participant.identity === localParticipant?.identity
  );

  return (
    <div className="w-2/3 border rounded-lg p-4 bg-white shadow-sm relative">
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse z-10 ${
        isRecording ? 'bg-red-600' : 'bg-gray-400'
      }`} />
      <h3 className="text-sm font-medium text-gray-500 mb-2">Your Video</h3>
      <div className="h-full">
        {localCameraTrack ? (
          <VideoTrack trackRef={localCameraTrack} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <p className="text-gray-500">Camera not available</p>
          </div>
        )}
      </div>
    </div>
  );
}