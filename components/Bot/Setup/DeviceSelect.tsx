import { useEffect } from 'react';
import { Mic, Webcam } from 'lucide-react';
import { useVoiceClientMediaDevices } from 'realtime-ai-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

import { AudioIndicatorBar } from './AudioIndicator';

/**
 * Props for the DeviceSelect component.
 * Currently empty as the component doesn't accept any props.
 */
interface DeviceSelectProps {}

/**
 * DeviceSelect component for selecting microphone and camera devices.
 *
 * This component uses the useVoiceClientMediaDevices hook to manage
 * available and selected audio and video devices.
 *
 * @returns {JSX.Element} The rendered DeviceSelect component
 */
export const DeviceSelect: React.FC<DeviceSelectProps> = () => {
  const {
    availableMics,
    selectedMic,
    updateMic,
    availableCams,
    selectedCam,
    updateCam
  } = useVoiceClientMediaDevices();

  // Update selected devices when they change
  useEffect(() => {
    updateMic(selectedMic?.deviceId);
    updateCam(selectedCam?.deviceId);
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {/* Microphone selection */}
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
              <SelectItem key={mic.deviceId} value={mic.deviceId || 'default'}>
                {mic.label || 'Unknown Microphone'}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <AudioIndicatorBar />

      {/* Camera selection */}
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
              <SelectItem key={cam.deviceId} value={cam.deviceId || 'default'}>
                {cam.label || 'Unknown Camera'}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DeviceSelect;
