import React from 'react';
import { MessageCircle } from 'lucide-react';

import { ttsVoices, Voice } from '@/utils/config';
import { Field } from '../ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../ui/select';

type LanguageSelectProps = {
  onSelect: (voice: Voice) => void;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onSelect }) => {
  return (
    <Field label="Voice:">
      <Select
        onValueChange={(value) =>
          onSelect(ttsVoices.find((voice) => voice.id === value)!)
        }
      >
        <SelectTrigger className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {ttsVoices.map((voice: Voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default LanguageSelect;
