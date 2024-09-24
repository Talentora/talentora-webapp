import React from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

const ModelBadge: React.FC = () => {
  const voiceClient = useVoiceClient()!;
  const [model, setModel] = React.useState<string | undefined>(undefined);

  const getModelFromConfig = () => {
    if (!voiceClient) return;

    voiceClient.getServiceOptionsFromConfig("llm").options.find((option: any) => {
      if (option.name === "model") {
        setModel(option.value as string);
      }
    });
  };

  useVoiceClientEvent(VoiceEvent.ConfigUpdated, () => {
    if (!voiceClient) return;
    getModelFromConfig();
  });

  return (
    <div className="absolute top-3 left-3 right-3 text-center z-50 uppercase text-xs font-semibold text-primary-500">
      {model}
    </div>
  );
};

export default ModelBadge;
