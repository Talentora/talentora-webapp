import React, { useCallback, useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { VoiceEvent } from 'realtime-ai';
import { useVoiceClient, useVoiceClientEvent } from 'realtime-ai-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

const ExpiryTimer: React.FC = () => {
  const voiceClient = useVoiceClient();
  const [exp, setExp] = useState<number | undefined>(undefined);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useVoiceClientEvent(
    VoiceEvent.Connected,
    useCallback(() => setExp(voiceClient?.transportExpiry), [voiceClient])
  );

  const noExpiry = !exp || exp === 0;

  useEffect(() => {
    if (noExpiry) return;

    const futureTimestamp = exp;

    // Function to update time
    const updateTime = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const differenceInSeconds = futureTimestamp! - currentTimestamp;
      const minutes = Math.floor(differenceInSeconds / 60);
      const seconds = differenceInSeconds % 60;
      setTime({ minutes, seconds });
    };

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Initial update
    updateTime();

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [noExpiry, exp]);

  if (noExpiry) return null;

  const isExpired = time.minutes <= 0 && time.seconds <= 0;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="ml-auto flex items-center text-sm bg-primary-100 rounded-lg px-3 py-2 border-t border-primary-200 gap-1.5">
          <Timer size={20} className="text-primary-400" />
          <span
            className={`font-semibold tracking-wider w-16 ${isExpired ? 'text-primary-400' : ''}`}
          >
            {isExpired
              ? '--:--'
              : `${time.minutes}m ${time.seconds.toString().padStart(2, '0')}s`}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remaining session time before expiry</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ExpiryTimer;
