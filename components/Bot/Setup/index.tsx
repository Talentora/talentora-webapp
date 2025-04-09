'use client';

import React from 'react';
import { Track } from 'livekit-client';
import { TrackToggle, MediaDeviceMenu, usePreviewTracks } from '@livekit/components-react';
import '@livekit/components-styles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfigureProps {
  onReady: () => Promise<void>;
}

export default function Configure({ onReady }: ConfigureProps) {
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [videoDeviceId, setVideoDeviceId] = React.useState('default');
  const [audioDeviceId, setAudioDeviceId] = React.useState('default');
  
  const tracks = usePreviewTracks({
    audio: audioEnabled ? { deviceId: audioDeviceId } : false,
    video: videoEnabled ? { deviceId: videoDeviceId } : false,
  });

  const videoEl = React.useRef<HTMLVideoElement>(null);
  
  const videoTrack = React.useMemo(
    () => tracks?.filter((track) => track.kind === Track.Kind.Video)[0] as any,
    [tracks],
  );

  const audioTrack = React.useMemo(
    () => tracks?.filter((track) => track.kind === Track.Kind.Audio)[0] as any,
    [tracks],
  );

  React.useEffect(() => {
    if (videoEl.current && videoTrack) {
      videoTrack.unmute();
      videoTrack.attach(videoEl.current);
    }

    return () => {
      videoTrack?.detach();
    };
  }, [videoTrack]);
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onReady();
  };

  const isReadyToStart = videoEnabled && audioEnabled;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg animate-appear shadow-lg border-opacity-50">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-center">Let's get you ready for your interview</h2>
        </div>
        
        <div className="lk-prejoin">
          <div className="lk-video-container">
            {videoTrack && videoEnabled ? (
              <video ref={videoEl} width="1280" height="720" autoPlay playsInline muted />
            ) : (
              <div className="lk-camera-off-note">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Camera is off</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="lk-button-group-container">
            <div className="lk-button-group audio">
              <TrackToggle
                initialState={audioEnabled}
                source={Track.Source.Microphone}
                onChange={(enabled) => setAudioEnabled(enabled)}
              >
                Microphone
              </TrackToggle>
              <div className="lk-button-group-menu">
                <MediaDeviceMenu 
                  kind="audioinput" 
                  tracks={{ audioinput: audioTrack }}
                  onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
                />
              </div>
            </div>
            
            <div className="lk-button-group video">
              <TrackToggle
                initialState={videoEnabled}
                source={Track.Source.Camera}
                onChange={(enabled) => setVideoEnabled(enabled)}
              >
                Camera
              </TrackToggle>
              <div className="lk-button-group-menu">
                <MediaDeviceMenu 
                  kind="videoinput" 
                  tracks={{ videoinput: videoTrack }}
                  onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
                />
              </div>
            </div>
          </div>

          <form className="lk-username-container">
            <Button
              className="w-1/2 mx-auto"
              type="submit"
              onClick={handleSubmit}
              disabled={!isReadyToStart}
            >
              Start Interview
            </Button>
            {!isReadyToStart && (
              <p className="text-sm text-center mt-2 text-gray-500">
                Please enable both camera and microphone to continue
              </p>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}
