'use client';
import { BotInfo } from '@/components/BotLibrary/BotInfo';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;
import { useEffect, useState } from 'react';
import { getBotById } from '@/utils/supabase/queries';
import { BotSkeleton } from '@/components/BotLibrary/BotSkeleton';

export default function BotPage({ params }: { params: { id: string } }) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const botId = parseInt(params.id);

  useEffect(() => {
    async function fetchBot() {
      try {
        const botData = await getBotById(botId.toString());
        if (!botData) {
          setError('Bot not found');
          return;
        }
        setBot(botData);
      } catch (err) {
        setError(`Failed to fetch bot, ${err}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (botId) {
      fetchBot();
    }
  }, [botId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading || !bot) {
    return <BotSkeleton />;
  }

  return <BotInfo bot={bot} />;
}
