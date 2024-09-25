import React, { useEffect, useRef, useState } from 'react';

// import HelpTip from "@/components/ui/helptip";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useVoiceClient } from 'realtime-ai-react';
import { LLMHelper } from 'realtime-ai';
import DeviceSelect from './DeviceSelect';

interface ConfigureProps {
  state: string;
  startAudioOff?: boolean;
  handleStartAudioOff?: () => void;
  inSession?: boolean;
}
export const Configure: React.FC<ConfigureProps> = React.memo(
  ({ startAudioOff, handleStartAudioOff, inSession = false }) => {
    const [showPrompt, setshowPrompt] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const voiceClient = useVoiceClient();

    const [context, setContext] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchContext = async () => {
        if (voiceClient) {
          try {
            setIsLoading(true);
            setError(null);
            const llmHelper = voiceClient.getHelper('llm') as LLMHelper;
            const ctx = await llmHelper.getContext();
            setContext(JSON.stringify(ctx, null, 2));
          } catch (err) {
            console.error('Error fetching context:', err);
            setError('Failed to fetch context. The bot may not be ready yet.');
          } finally {
            setIsLoading(false);
          }
        } else {
          setError('Voice client is not available.');
          setIsLoading(false);
        }
      };

      fetchContext();
    }, [voiceClient]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showPrompt) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showPrompt]);

    return (
      <div className="flex flex-col gap-0">
        <section className="mt-4 border-t border-primary-hairline pt-4">
          <h3 className="text-lg font-semibold mb-2">Current LLM Context:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
            {context}
          </pre>
        </section>
        <section className="flex flex-col flex-wrap">
          <DeviceSelect />
        </section>

        {!inSession && (
          <section className="flex flex-col gap-4 border-y border-primary-hairline py-4 mt-4">
            <div className="flex flex-row justify-between items-center">
              <Label className="flex flex-row gap-1 items-center">
                Join with mic muted{' '}
                {/* <HelpTip text="Start with microphone muted (click to unmute)" /> */}
              </Label>
              <Switch
                checked={startAudioOff}
                onCheckedChange={handleStartAudioOff}
              />
            </div>
          </section>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.startAudioOff === nextProps.startAudioOff &&
    prevProps.state === nextProps.state
);
Configure.displayName = 'Configure';
