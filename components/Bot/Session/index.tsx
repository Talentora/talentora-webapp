import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { PipecatMetrics, TransportState, VoiceEvent } from 'realtime-ai';
import { useVoiceClient, useVoiceClientEvent } from 'realtime-ai-react';

import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import TranscriptOverlay from './TranscriptOverlay';
import Agent from './Agent';
import UserMicBubble from './UserMicBubble';

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const Session = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    const voiceClient = useVoiceClient()!;
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [showDevices, setShowDevices] = useState<boolean>(false);
    const [muted, setMuted] = useState(startAudioOff);
    const modalRef = useRef<HTMLDialogElement>(null);

    // ---- Voice Client Events

    useVoiceClientEvent(
      VoiceEvent.BotStoppedSpeaking,
      useCallback(() => {
        if (hasStarted) return;
        setHasStarted(true);
      }, [hasStarted])
    );

    // ---- Effects

    useEffect(() => {
      // Reset started state on mount
      setHasStarted(false);
    }, []);

    useEffect(() => {
      // If we joined unmuted, enable the mic once in ready state
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === 'error') {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showDevices) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showDevices]);

    function toggleMute() {
      voiceClient.enableMic(muted);
      setMuted(!muted);
    }

    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center w-full">
          <Card.Card className="w-2/3 h-1/2 shadow-long">
            <Agent isReady={state === 'ready'} />
            {/* <TranscriptOverlay /> */}
          </Card.Card>
          <UserMicBubble
            active={hasStarted}
            muted={muted}
            handleMute={() => toggleMute()}
          />
        </div>
        <footer className="w-full flex mt-auto self-end md:w-auto">
          <div className="flex justify-between gap-3 w-full md:w-auto">
            <div className="ml-auto fixed bottom-4 right-4">
              <Button onClick={() => onLeave()}>
                <LogOut size={16} />
                End
              </Button>
            </div>
          </div>
        </footer>
      </>
    );
  },
  (p, n) => p.state === n.state
);

Session.displayName = 'Session';

export default Session;
