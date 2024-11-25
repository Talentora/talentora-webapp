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
  const { canSendAudio, canSendVideo } = usePermissions();

  console.log("Can Send Audio", canSendAudio);
  console.log("Can Send Video", canSendVideo);


  // useEffect(() => {
  //   // voiceClient.isCamEnabled = true;
  //   voiceClient?.setCameraEnabled(isCameraOn);
  // }, []);

  console.log("Voice Client", voiceClient);
  console.log("Is Camera On", isCameraOn);

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
        <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white rounded-lg">
          <p>Camera Off</p>
        </div>
      )}
    </div>
  );
}
