import { useEffect } from 'react';
import { Mic, Webcam } from 'lucide-react';
import { useVoiceClientMediaDevices } from 'realtime-ai-react';

import { Field } from '@/components/ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

import { AudioIndicatorBar } from './AudioIndicator';

interface DeviceSelectProps {}

export const DeviceSelect: React.FC<DeviceSelectProps> = () => {
  const {
    availableMics,
    selectedMic,
    updateMic,
    availableCams,
    selectedCam,
    updateCam
  } = useVoiceClientMediaDevices();

  useEffect(() => {
    updateMic(selectedMic?.deviceId);
    updateCam(selectedCam?.deviceId);
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {/* <Field label="Microphone" error={false}> */}
      <Select onValueChange={(value) => updateMic(value)}>
        <SelectTrigger>
          <Mic size={24} />
          <SelectValue placeholder="Select a microphone" />
        </SelectTrigger>
        <SelectContent>
          {availableMics.length === 0 ? (
            <SelectItem value="loading">Loading devices...</SelectItem>
          ) : (
            availableMics.map((mic) => (
              <SelectItem key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <AudioIndicatorBar />
      {/* </Field> */}

      {/* <Field label="Camera" error={false}> */}
      <Select onValueChange={(value) => updateCam(value)}>
        <SelectTrigger>
          <Webcam size={24} />
          <SelectValue placeholder="Select a camera" />
        </SelectTrigger>
        <SelectContent>
          {availableCams.length === 0 ? (
            <SelectItem value="loading">Loading devices...</SelectItem>
          ) : (
            availableCams.map((cam) => (
              <SelectItem key={cam.deviceId} value={cam.deviceId}>
                {cam.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {/* </Field> */}
    </div>
  );
};

export default DeviceSelect;
