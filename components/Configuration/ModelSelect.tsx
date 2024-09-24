import React from 'react';
import { Package } from 'lucide-react';

import { LLM_MODEL_CHOICES } from '@/utils/rtvi.config';
import { Field } from '@/components/ui/field';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

type ModelSelectProps = {
  onSelect: (model: string) => void;
};

const ModelSelect: React.FC<ModelSelectProps> = ({ onSelect }) => {
  return (
    <Field label="LLM Model:">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <Package className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {LLM_MODEL_CHOICES.map((choice) =>
            choice.models.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default ModelSelect;