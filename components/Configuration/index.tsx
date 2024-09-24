import React from 'react';
import { VoiceClientConfigOption } from 'realtime-ai';
import { useVoiceClient } from 'realtime-ai-react';

import { LANGUAGES, LLM_MODEL_CHOICES, PRESET_CHARACTERS } from '@/utils/rtvi.config';

import ModelSelect from './ModelSelect';
import VoiceSelect from './VoiceSelect';

const Configuration: React.FC<{ showAllOptions: boolean }> = () => {
  const voiceClient = useVoiceClient()!;

  const updateConfig = (config: VoiceClientConfigOption) => {
    const updateOpts =
      voiceClient.state === 'ready'
        ? { sendPartial: true }
        : { useDeepMerge: true };

    voiceClient.updateConfig(config, updateOpts);
  };

  const handleVoiceChange = (voice: Voice) => {
    updateConfig({
      tts: { voice: voice.id }
    });

    // Prompt the LLM to speak
    voiceClient.appendLLMContext({
      role: 'assistant',
      content: 'Ask if the user prefers the new voice you have been given.'
    });
  };

  const handleModelChange = (model: string) => {
    updateConfig({
      llm: { model: model }
    });

    if (voiceClient.state === 'ready') {
      voiceClient.interrupt();

      setTimeout(() => {
        voiceClient.appendLLMContext({
          role: 'user',
          content: `I just changed your model to use ${model}! Thank me for the change.`
        });
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ModelSelect
        models={LLM_MODEL_CHOICES}
        onSelect={(model) => handleModelChange(model)}
      />
      <VoiceSelect
        voices={LANGUAGES.map(lang => ({ id: lang.default_voice, label: lang.label }))}
        onSelect={(voice: Voice) => handleVoiceChange(voice)}
      />
    </div>
  );
};

export default Configuration;