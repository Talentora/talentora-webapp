import React from 'react';
import { RTVIClientVideo, useRTVIClientMediaDevices, useRTVIClient, VoiceVisualizer } from "@pipecat-ai/client-react";

export default function CandidateVideo() {
  const client = useRTVIClient();
  const { selectedCam } = useRTVIClientMediaDevices();
  const isVideoEnabled = selectedCam && client?.isCamEnabled;

  return (
    <div className="bg-black rounded-lg aspect-video relative">
      {/* <h1 className="t  ext-white">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1> */}
      {isVideoEnabled ? (
        <>
          <RTVIClientVideo
            participant="local"
            className="h-full w-full object-cover rounded-lg"
            // fit="cover"
            mirror={true}
            onError={(error) => console.error('[VIDEO] Video error:', error)}
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-25 flex items-center justify-center">
            <VoiceVisualizer
              participantType="local"
              barColor="white"
              barGap={5}
              barWidth={10}
              barMaxHeight={30}
            />
          </div>
        </>
      ) : (
        <div className="h-full w-full items-center flex justify-center bg-gray-800 text-white rounded-lg">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
