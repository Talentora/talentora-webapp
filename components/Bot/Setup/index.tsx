'use client';

import React, { useEffect, useState } from 'react';
import { useRTVIClient, useRTVIClientMediaDevices } from 'realtime-ai-react';
import { VoiceVisualizer } from 'realtime-ai-react';
import { RTVIClientVideo } from 'realtime-ai-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const Configure: React.FC<{ onStartInterview: () => void }> = ({
  onStartInterview
}) => {
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const [loading, setLoading] = useState(false);
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
      console.warn('No microphone selected');
    }
    if (selectedCam) {
      updateCam(selectedCam.deviceId);
    }
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  const handleNextToCamera = () => {
    setShowCameraSelection(!showCameraSelection);
  };

  const handleStartInterview = () => {
    setLoading(true);
    onStartInterview();
  };
  useEffect(() => {
    async function requestMediaPermissions() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
    requestMediaPermissions();
  }, []);

  return (
    <div className="flex flex-col items-center h-1/2">
      {!showCameraSelection ? (
        <Card className="w-full  border border-none">
          <CardHeader>
            <CardTitle>Select Your Microphone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableMics.length === 0 ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-gray-500">
                  Loading audio devices...
                </p>
              </div>
            ) : (
              <>
                <Select
                  value={selectedMic?.deviceId || ''}
                  onValueChange={updateMic}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMics.map(
                      (mic: { deviceId: string; label: string }) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                {selectedMic && (
                  <div className=" flex flex-col items-center justify-center">
                    <div className="flex justify-center">
                      <VoiceVisualizer participantType="local" />
                    </div>
                    <Button onClick={handleNextToCamera} className="w-1/5">
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full border-none p-4">
          <CardHeader>
            <CardTitle>Select Your Camera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableCams.length === 0 ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-gray-500">
                  Loading video devices...
                </p>
              </div>
            ) : (
              <>
                <Select
                  value={selectedCam?.deviceId || ''}
                  onValueChange={updateCam}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCams.map(
                      (camera: { deviceId: string; label: string }) => (
                        <SelectItem
                          key={camera.deviceId}
                          value={camera.deviceId}
                        >
                          {camera.label}
                        </SelectItem>
                      )
                    )}
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
                      <Button onClick={handleStartInterview} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading Interview...
                          </>
                        ) : (
                          'Start Interview'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Configure;
