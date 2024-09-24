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

type Voice = {
  id: string;
  label: string;
};

type VoiceSelectProps = {
  onSelect: (voice: Voice) => void;
};

const VoiceSelect: React.FC<VoiceSelectProps> = ({ onSelect }) => {
  const voices: Voice[] = LANGUAGES.map(lang => ({
    id: lang.default_voice,
    label: `${lang.label} Voice`
  }));

  return (
    <Field label="Voice:">
      <Select
        onValueChange={(value) =>
          onSelect(voices.find((voice) => voice.id === value)!)
        }
      >
        <SelectTrigger className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default VoiceSelect;