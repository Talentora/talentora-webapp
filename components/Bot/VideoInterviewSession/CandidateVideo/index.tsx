import React from 'react';
import { RTVIClientVideo, useRTVIClientMediaDevices, useRTVIClient } from "@pipecat-ai/client-react";

export default function CandidateVideo() {
  const client = useRTVIClient();
  const { selectedCam } = useRTVIClientMediaDevices();
  const isVideoEnabled = selectedCam && client?.isCamEnabled;

  return (
    <div className="bg-black rounded-lg aspect-video">
      {/* <h1 className="t  ext-white">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1> */}
      {isVideoEnabled ? (
        <RTVIClientVideo
          participant="local"
          className="h-full w-full object-cover rounded-lg"
          // fit="cover"
          mirror={true}
          onError={(error) => console.error('[VIDEO] Video error:', error)}
        />
      ) : (
        <div className="h-full w-full items-center flex justify-center bg-gray-800 text-white rounded-lg">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
