'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  RTVIClientVideo,
  useRTVIClient,
  useRTVIClientMediaDevices,
  VoiceVisualizer
} from '@pipecat-ai/client-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Loader2, Volume2, Mic, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type SetupStage = 'speaker' | 'microphone' | 'camera';

const stageToTitle: Record<SetupStage, string> = {
  speaker: 'Speaker Setup',
  microphone: 'Microphone Setup',
  camera: 'Camera Setup'
};

const stageToIcon: Record<SetupStage, React.ReactNode> = {
  speaker: <Volume2 className="h-5 w-5" />,
  microphone: <Mic className="h-5 w-5" />,
  camera: <Camera className="h-5 w-5" />
};

const Configure: React.FC<{ onStartInterview: () => void }> = ({
  onStartInterview
}) => {
  const [currentStage, setCurrentStage] = useState<SetupStage>('speaker');
  const [loading, setLoading] = useState(false);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const [devicesInitialized, setDevicesInitialized] = useState(false);
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const client = useRTVIClient()!;
  const {
    availableCams,
    availableMics,
    selectedCam,
    selectedMic,
    updateCam,
    updateMic
  } = useRTVIClientMediaDevices();

  // Request media permissions and initialize devices
  useEffect(() => {
    async function initializeDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });

        // Get audio output devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakers = devices.filter(
          (device) => device.kind === 'audiooutput'
        );
        setAvailableSpeakers(speakers);

        // Set default speaker if available
        if (speakers.length > 0) {
          setSelectedSpeaker(speakers[0].deviceId);
        }

        setDevicesInitialized(true);
        // Clean up the stream
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
    initializeDevices();
  }, []);
  // Update speaker when selection changes
  useEffect(() => {
    if (!selectedSpeaker) return;

    // Try to set audio output device if browser supports it
    if ('setSinkId' in HTMLAudioElement.prototype) {
      const audio = document.createElement('audio');
      audio
        .setSinkId(selectedSpeaker)
        .catch((err: Error) =>
          console.error('Error setting audio output device:', err)
        );
    }
  }, [selectedSpeaker]);

  const playTestSound = async () => {
    setIsPlayingTest(true);
    try {
      const audio = new Audio('/sounds/ding.mp3');
      if ('setSinkId' in HTMLAudioElement.prototype) {
        await audio.setSinkId(selectedSpeaker);
      }
      audio.volume = 1.0; // Ensure volume is at maximum
      await audio.load(); // Preload the audio
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise; // Handle play promise properly
      }
      setTimeout(() => setIsPlayingTest(false), 1000);
    } catch (err) {
      console.error('Error playing test sound:', err);
      setIsPlayingTest(false);
    }
  };

  // Initialize devices when they become available
  useEffect(() => {
    if (!devicesInitialized) return;

    if (availableMics.length > 0 && !selectedMic) {
      updateMic(availableMics[0].deviceId);
    }
    if (availableCams.length > 0 && !selectedCam) {
      updateCam(availableCams[0].deviceId);
    }
  }, [
    availableMics,
    availableCams,
    selectedMic,
    selectedCam,
    updateMic,
    updateCam,
    devicesInitialized
  ]);

  // Update devices when selection changes
  useEffect(() => {
    if (!devicesInitialized) return;

    if (selectedMic?.deviceId) {
      updateMic(selectedMic.deviceId);
      client.enableMic(!startAudioOff);
    }
    if (selectedCam?.deviceId) {
      updateCam(selectedCam.deviceId);
    }
  }, [
    selectedMic,
    selectedCam,
    updateMic,
    updateCam,
    client,
    startAudioOff,
    devicesInitialized
  ]);

  const handleNext = () => {
    switch (currentStage) {
      case 'speaker':
        setCurrentStage('microphone');
        break;
      case 'microphone':
        setCurrentStage('camera');
        break;
      case 'camera':
        setLoading(true);
        onStartInterview();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStage) {
      case 'microphone':
        setCurrentStage('speaker');
        break;
      case 'camera':
        setCurrentStage('microphone');
        break;
    }
  };

  const getButtonText = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting Interview...
        </>
      );
    }
    return currentStage === 'camera' ? 'Start Interview' : 'Next';
  };

  const renderSpeakerSetup = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Audio Output</label>
        <div className="flex gap-2">
          <Select
            value={selectedSpeaker}
            onValueChange={(value) => {
              setSelectedSpeaker(value);
              // Play test sound when speaker is selected to verify it works
              playTestSound();
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select speakers" />
            </SelectTrigger>
            <SelectContent>
              {availableSpeakers.map((speaker) => (
                <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                  {speaker.label || 'Default Speaker'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={playTestSound}
            disabled={isPlayingTest || !selectedSpeaker}
          >
            <Volume2 className={isPlayingTest ? 'animate-pulse' : ''} />
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        {!selectedSpeaker ? (
          <p>Please select a speaker device and test the audio</p>
        ) : (
          <p>Click the speaker icon to test your audio output</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!selectedSpeaker}>
          {getButtonText()}
        </Button>
      </div>
    </div>
  );

  const renderMicrophoneSetup = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Microphone Input
        </label>
        <Select value={selectedMic?.deviceId || ''} onValueChange={updateMic}>
          <SelectTrigger>
            <SelectValue placeholder="Select a microphone" />
          </SelectTrigger>
          <SelectContent>
            {availableMics.map((mic: { deviceId: string; label: string }) => (
              <SelectItem key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedMic && (
        <div className="flex justify-center py-4">
          <VoiceVisualizer participantType="local" />
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedMic}>
          {getButtonText()}
        </Button>
      </div>
    </div>
  );

  const renderCameraSetup = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Camera Input</label>
        <Select value={selectedCam?.deviceId || ''} onValueChange={updateCam}>
          <SelectTrigger>
            <SelectValue placeholder="Select a camera" />
          </SelectTrigger>
          <SelectContent>
            {availableCams.map(
              (camera: { deviceId: string; label: string }) => (
                <SelectItem key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      {selectedCam && (
        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          <RTVIClientVideo participant="local" fit="contain" mirror={true} />
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedCam || loading}
          variant={currentStage === 'camera' ? 'default' : 'outline'}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );

  const getCurrentStageContent = () => {
    if (!devicesInitialized) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-gray-500">Loading devices...</p>
        </div>
      );
    }

    switch (currentStage) {
      case 'speaker':
        return renderSpeakerSetup();
      case 'microphone':
        return renderMicrophoneSetup();
      case 'camera':
        return renderCameraSetup();
    }
  };

  const stageToProgress = {
    speaker: 33,
    microphone: 66,
    camera: 100
  };

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {stageToIcon[currentStage]}
          <CardTitle>{stageToTitle[currentStage]}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {getCurrentStageContent()}
        <div className="mt-4 space-y-1">
          <Progress
            value={stageToProgress[currentStage]}
            className="h-1 bg-muted mt-10 [&>div]:bg-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Step {Object.keys(stageToTitle).indexOf(currentStage) + 1} of 3
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Configure;
