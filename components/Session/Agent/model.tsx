import React, { useCallback } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

const ModelBadge: React.FC = () => {
  const { config } = useVoiceClient()!;
  const [model, setModel] = React.useState<string | undefined>(
    config?.llm?.model
  );

  useVoiceClientEvent(
    VoiceEvent.ConfigUpdated,
    useCallback((e) => {
      setModel(e?.llm?.model);
    }, [])
  );

  return (
    <div className="absolute top-3 left-3 right-3 text-center z-99 uppercase text-xs font-semibold text-primary-500">
      {model}
    </div>
  );
};

export default ModelBadge;
