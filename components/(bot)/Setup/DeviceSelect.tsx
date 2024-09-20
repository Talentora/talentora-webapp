import { useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useVoiceClientMediaDevices } from 'realtime-ai-react';
import { AudioIndicatorBar } from '../AudioIndicator';
import { Field } from '../../ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../../ui/select';

export const DeviceSelect: React.FC<DeviceSelectProps> = () => {
  const { availableMics, selectedMic, updateMic } =
    useVoiceClientMediaDevices();

  useEffect(() => {
    if (selectedMic) {
      updateMic(selectedMic.deviceId);
    }
  }, [updateMic, selectedMic]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <Field label="Microphone:" error={false}>
        <Select onValueChange={(value) => updateMic(value)}>
          <SelectTrigger className="w-full">
            <Mic className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select a microphone" />
          </SelectTrigger>
          <SelectContent>
            {availableMics.length === 0 ? (
              <SelectItem value="null" disabled>
                Loading devices...
              </SelectItem>
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
      </Field>
    </div>
  );
};

export default DeviceSelect;
