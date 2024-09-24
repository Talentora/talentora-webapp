import React from 'react';
import { VoiceClientConfigOption } from 'realtime-ai';
import { useVoiceClient } from 'realtime-ai-react';

import { LANGUAGES } from '@/utils/rtvi.config';

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

    voiceClient.updateConfig(config);
  };

  const handleVoiceChange = (voice: Voice) => {
    updateConfig({
      tts: { voice: voice.id }
    });

    // Prompt the LLM to speak
    voiceClient.sendMessage({
      role: 'assistant',
      content: 'Ask if the user prefers the new voice you have been given.'
    });
  };

  const handleModelChange = (model: string) => {
    updateConfig({
      llm: { model: model }
    });

    if (voiceClient.state === 'ready') {
      voiceClient.stop();

      setTimeout(() => {
        voiceClient.sendMessage({
          role: 'user',
          content: `I just changed your model to use ${model}! Thank me for the change.`
        });
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