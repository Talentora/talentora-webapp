import React, { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useVoiceClient } from 'realtime-ai-react';
import { LLMHelper } from 'realtime-ai';
import DeviceSelect from './DeviceSelect';
/**
 * Props for the Configure component
 */
interface ConfigureProps {
  /** Current state of the application */
  state: string;
  /** Whether to start with audio off */
  startAudioOff?: boolean;
  /** Function to handle toggling startAudioOff */
  handleStartAudioOff?: () => void;
  /** Whether the component is being used in an active session */
  inSession?: boolean;
}

/**
 * Configure component for setting up audio devices and preferences
 *
 * @param {ConfigureProps} props - The props for the Configure component
 * @returns {JSX.Element} The rendered Configure component
 */
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
        <section className="flex flex-col flex-wrap">
          <DeviceSelect />
        </section>

        <section className="flex flex-col gap-4 border-y border-primary-hairline py-4 mt-4">
          <div className="flex flex-row justify-between items-center">
            <Label className="flex flex-row gap-1 items-center">
              Join with mic muted
            </Label>
            <Switch
              checked={startAudioOff}
              onCheckedChange={handleStartAudioOff}
            />
          </div>
        </section>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.startAudioOff === nextProps.startAudioOff &&
    prevProps.state === nextProps.state
);

Configure.displayName = 'Configure';
