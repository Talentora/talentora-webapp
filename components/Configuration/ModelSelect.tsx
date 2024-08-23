import React from "react";
import { Package } from "lucide-react";

import { LLMModel, llmModels } from "@/utils/config";
import { Field } from "../ui/field";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

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
          {llmModels.map((model: LLMModel) => (
            <SelectItem key={model.id} value={model.id}>
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};

export default ModelSelect;
