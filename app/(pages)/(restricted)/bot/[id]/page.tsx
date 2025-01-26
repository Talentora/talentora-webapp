'use client';
import { BotInfo } from '@/components/BotLibrary/BotInfo';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;
import { useEffect, useState } from 'react';
import { getBotById } from '@/utils/supabase/queries';
import { BotSkeleton } from '@/components/BotLibrary/BotSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BotPage({ params }: { params: { id: string } }) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const botId = parseInt(params.id);
  const router = useRouter();

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

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/bot')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Bots
      </Button>
      <BotInfo bot={bot} />
    </div>
  );
}
