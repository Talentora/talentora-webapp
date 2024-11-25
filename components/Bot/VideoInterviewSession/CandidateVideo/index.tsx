import React from 'react';
import { RTVIClientVideo, useRTVIClient } from 'realtime-ai-react';
import { useEffect } from 'react';
import { useParticipant, usePermissions } from '@daily-co/daily-react';

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
    <div className="bg-black rounded-lg">
      {/* <h1 className="t  ext-white">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1> */}
      {isCameraOn ? (
        <RTVIClientVideo
          participant="local"
          className="h-full w-full object-cover rounded-lg"
          // fit="cover"
          mirror={true}
        />
      ) : (
        <div className="h-full w-full items-center flex justify-center bg-gray-800 text-white rounded-lg">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
