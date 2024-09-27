import React from 'react';
import { VoiceClientConfigOption, VoiceMessage } from 'realtime-ai';
import { useVoiceClient } from 'realtime-ai-react';

import ModelSelect from '@/components/Configuration/ModelSelect';
import VoiceSelect from '@/components/Configuration/VoiceSelect';

type Voice = {
  id: string;
  label: string;
};

const Configuration: React.FC<{ showAllOptions: boolean }> = () => {
  const voiceClient = useVoiceClient()!;

  const updateConfig = (config: VoiceClientConfigOption) => {
    const updateOpts =
      voiceClient.state === 'ready'
        ? { sendPartial: true }
        : { useDeepMerge: true };

    voiceClient.updateConfig([config], updateOpts);
  };

  const handleVoiceChange = (voice: Voice) => {
    updateConfig({
      tts: { voice: voice.id }
    });

    // Prompt the LLM to speak
    const message: VoiceMessage = {
      content: 'Ask if the user prefers the new voice you have been given.'
    };
    voiceClient.sendMessage(message);
  };

  const handleModelChange = (model: string) => {
    updateConfig({
      llm: { model: model }
    });

    if (voiceClient.state === 'ready') {
      voiceClient.stopPlayback();

      setTimeout(() => {
        const message: VoiceMessage = {
          content: `I just changed your model to use ${model}! Thank me for the change.`
        };
        voiceClient.sendMessage(message);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ModelSelect onSelect={handleModelChange} />
      <VoiceSelect onSelect={handleVoiceChange} />
    </div>
  );
};

export default Configuration;
