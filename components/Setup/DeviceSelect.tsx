import { useEffect } from "react";
import { Mic, Camera } from "lucide-react";
import { useVoiceClientMediaDevices } from "realtime-ai-react";

import { Field } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";

import { AudioIndicatorBar } from "./AudioIndicator";

interface DeviceSelectProps {
  hideMeter: boolean;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  const { availableMics, selectedMic, updateMic, availableCams, selectedCam, updateCam } =
    useVoiceClientMediaDevices();

  useEffect(() => {
    updateMic(selectedMic?.deviceId);
    updateCam(selectedCam?.deviceId);
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <Field label="Microphone" error={false}>
        <Select onValueChange={(value) => updateMic(value)}>
          <SelectTrigger>
            <Mic size={24} />
            <SelectValue placeholder="Select a microphone" />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Microphones</SelectLabel>
              {availableMics?.length === 0 ? (
                <SelectItem value="loading">Loading devices...</SelectItem>
              ) : (
                availableMics?.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId || "unknown"}>
                    {mic.label || "Unknown Device"}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
        {!hideMeter && <AudioIndicatorBar />}
      </Field>
      <Field label="Camera" error={false}>
        <Select onValueChange={(value) => updateCam(value)}>
          <SelectTrigger>
            <Camera size={24} />
            <SelectValue placeholder="Select a camera" />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Cameras</SelectLabel>
              {availableCams?.length === 0 ? (
                <SelectItem value="loading">Loading devices...</SelectItem>
              ) : (
                availableCams?.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId || "unknown"}>
                    {camera.label || "Unknown Device"}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
};

export default DeviceSelect;
