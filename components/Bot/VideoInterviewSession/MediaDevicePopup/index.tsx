import React, { useEffect, useState } from 'react';
import { useRTVIClient, useRTVIClientMediaDevices } from '@pipecat-ai/client-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Settings2, Volume2, Mic, Camera, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MediaDevicePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const client = useRTVIClient()!;
  const {
    availableCams,
    availableMics,
    selectedCam,
    selectedMic,
    updateCam,
    updateMic,
  } = useRTVIClientMediaDevices();

  // Get audio output devices
  useEffect(() => {
    async function getSpeakers() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const speakers = devices.filter(device => device.kind === 'audiooutput');
      setAvailableSpeakers(speakers);
      
      // Set default speaker if available
      if (speakers.length > 0 && !selectedSpeaker) {
        setSelectedSpeaker(speakers[0].deviceId);
      }
    }
    getSpeakers();
  }, [selectedSpeaker]);

  // Update speaker when selection changes
  useEffect(() => {
    if (!selectedSpeaker) return;
    
    if ('setSinkId' in HTMLAudioElement.prototype) {
      const audio = document.createElement('audio');
      audio.setSinkId(selectedSpeaker)
        .catch((err: Error) => console.error('Error setting audio output device:', err));
    }
  }, [selectedSpeaker]);

  const playTestSound = async () => {
    setIsPlayingTest(true);
    try {
      const audio = new Audio('/sounds/ding.mp3');
      if ('setSinkId' in HTMLAudioElement.prototype) {
        await audio.setSinkId(selectedSpeaker);
      }
      audio.volume = 1.0;
      await audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setTimeout(() => setIsPlayingTest(false), 1000);
    } catch (err) {
      console.error('Error playing test sound:', err);
      setIsPlayingTest(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-4 rounded-full shadow-lg"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Media Device Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="speaker">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="speaker">
              <Volume2 className="h-4 w-4 mr-2" />
              Speaker
            </TabsTrigger>
            <TabsTrigger value="microphone">
              <Mic className="h-4 w-4 mr-2" />
              Microphone
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="speaker" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Audio Output</label>
              <div className="flex gap-2">
                <Select
                  value={selectedSpeaker}
                  onValueChange={(value) => {
                    setSelectedSpeaker(value);
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
                  <Volume2 className={isPlayingTest ? "animate-pulse" : ""} />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="microphone" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Microphone Input</label>
              <Select
                value={selectedMic?.deviceId || ''}
                onValueChange={updateMic}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a microphone" />
                </SelectTrigger>
                <SelectContent>
                  {availableMics.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || 'Default Microphone'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Camera</label>
              <Select
                value={selectedCam?.deviceId || ''}
                onValueChange={updateCam}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a camera" />
                </SelectTrigger>
                <SelectContent>
                  {availableCams.map((cam) => (
                    <SelectItem key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || 'Default Camera'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 