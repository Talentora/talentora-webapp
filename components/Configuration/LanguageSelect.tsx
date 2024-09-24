import React from 'react';
import { MessageCircle } from 'lucide-react';

import { LANGUAGES } from '@/utils/rtvi.config';
import { Field } from '../ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../ui/select';

type LanguageSelectProps = {
  onSelect: (language: typeof LANGUAGES[0]) => void;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onSelect }) => {
  return (
    <Field label="Language:">
      <Select
        onValueChange={(value) =>
          onSelect(LANGUAGES.find((lang) => lang.value === value)!)
        }
      >
        <SelectTrigger className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default LanguageSelect;