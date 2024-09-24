import React from 'react';
import { MessageCircle } from 'lucide-react';

import { LANGUAGES } from '@/utils/rtvi.config';
import { Field } from '@/components/ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

type VoiceSelectProps = {
  onSelect: (voice: { id: string; label: string }) => void;
};

const VoiceSelect: React.FC<VoiceSelectProps> = ({ onSelect }) => {
  return (
    <Field label="Voice:">
      <Select
        onValueChange={(value) =>
          onSelect(LANGUAGES.find((voice) => voice.default_voice === value)!)
        }
      >
        <SelectTrigger className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((voice) => (
            <SelectItem key={voice.default_voice} value={voice.default_voice}>
              {voice.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default VoiceSelect;