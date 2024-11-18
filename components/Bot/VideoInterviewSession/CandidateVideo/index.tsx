import React from 'react';
import { RTVIClientVideo, useRTVIClient } from 'realtime-ai-react';
import { useEffect } from 'react';

export default function CandidateVideo({
  isCameraOn,
}: {
  isCameraOn: boolean;
}) {


  useEffect(() => {
    console.log("Is Camera On", isCameraOn);
  }, [isCameraOn]);

  const voiceClient = useRTVIClient();

  // useEffect(() => {
  //   // voiceClient.isCamEnabled = true;
  //   voiceClient?.setCameraEnabled(isCameraOn);
  // }, []);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* <h1 className="t  ext-white">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1> */}
      {isCameraOn ? (
        <RTVIClientVideo
          participant="local"
          className="h-full w-full object-cover"
          // fit="cover"
          mirror
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-800 text-white">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
