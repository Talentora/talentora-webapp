'use client';
import BotLibrary from '@/components/BotLibrary';
import { useBots } from '@/hooks/useBots';
import { BotLibrarySkeleton } from '@/components/BotLibrary/BotSkeleton';

export default function Page() {
  const { bots, loading } = useBots();

  if (!bots) return null;

  if (loading) {
    return <BotLibrarySkeleton />;
  }

  return <BotLibrary bots={bots} />;
}
