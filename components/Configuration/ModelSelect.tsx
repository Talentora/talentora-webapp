import React from "react";
import { Package } from "lucide-react";

import { LLMModel, llmModels } from "@/utils/rtvi.config";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

type ModelSelectProps = {
  onSelect: (model: string) => void;
};

const ModelSelect: React.FC<ModelSelectProps> = ({ onSelect }) => {
  return (
    <Field label="LLM Model:">
      <Select
        onChange={(e) => onSelect(e.currentTarget.value)}
        icon={<Package size={24} />}
      >
        {llmModels.map((model: LLMModel) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </Select>
    </Field>
  );
};

export default ModelSelect;