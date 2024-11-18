import React from 'react';
import { RTVIClientVideo } from 'realtime-ai-react';


export default function CandidateVideo({
  isCameraOn,
}: {
  isCameraOn: boolean;
}) {
  return (
    <div className="relative bg-black rounded-lg overflow-hidden h-full">
      <h1 className="text-white">Is Camera On: {isCameraOn ? 'Yes' : 'No'}</h1>
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
