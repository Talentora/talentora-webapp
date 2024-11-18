'use client';

import React, { useEffect, useState } from 'react';
import { useRTVIClient, useRTVIClientMediaDevices } from 'realtime-ai-react';
import { VoiceVisualizer } from 'realtime-ai-react';
import { RTVIClientVideo } from 'realtime-ai-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const Configure: React.FC<{ onStartInterview: () => void }> = ({ onStartInterview }) => {
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const voiceClient = useRTVIClient()!;

  const {
    availableMics,
    selectedMic,
    updateMic,
    availableCams,
    selectedCam,
    updateCam
  } = useRTVIClientMediaDevices();

  useEffect(() => {
    if (selectedMic) {
      updateMic(selectedMic.deviceId);
    } else {
      console.warn("No microphone selected");
    }
    if (selectedCam) {
      updateCam(selectedCam.deviceId);
    }
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  const handleNextToCamera = () => {
    setShowCameraSelection(!showCameraSelection);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      {!showCameraSelection ? (
        <Card className="w-full border border-gray-200 p-4 bg-foreground">
          <CardHeader>
            <CardTitle>Select Your Microphone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedMic?.deviceId || ''} onValueChange={updateMic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a microphone" />
              </SelectTrigger>
              <SelectContent>
                {availableMics.map(mic => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId || 'default'}>
                    {mic.label || 'Unknown Microphone'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedMic && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <VoiceVisualizer participantType="local" />
                </div>
                <Button onClick={handleNextToCamera} className="w-full">
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full border border-gray-200 p-4 bg-foreground">
          <CardHeader>
            <CardTitle>Select Your Camera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCam?.deviceId || ''} onValueChange={updateCam}>
              <SelectTrigger>
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                {availableCams.map(camera => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId || 'default'}>
                    {camera.label || 'Unknown Camera'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCam && (
              <div className="space-y-4">
                <RTVIClientVideo
                  participant="local"
                  fit="contain"
                  mirror={true}
                />
                <div className="flex justify-between">
                  <Button onClick={handleNextToCamera} variant="outline">
                    Back
                  </Button>
                  <Button onClick={onStartInterview}>
                    Start Interview
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Configure;