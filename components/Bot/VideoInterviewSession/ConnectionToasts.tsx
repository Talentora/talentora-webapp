import React from 'react';
import { ConnectionStateToast, Toast, useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';

export default function ConnectionToasts() {
  const connectionState = useConnectionState();
  const room = useRoomContext();

  return (
    <div>
      {/* Connection state toast with enhanced visibility */}
      <div className="absolute top-4 right-4 z-50">
        <ConnectionStateToast 
          room={room} 
          className="!bg-primary !text-primary-foreground !shadow-lg !font-medium !px-4 !py-2 !rounded-md" 
        />
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
  );
} 