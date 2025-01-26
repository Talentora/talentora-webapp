'use client';
import BotLibrary from '@/components/BotLibrary';
import { useBots } from '@/hooks/useBots';
import { BotLibrarySkeleton } from '@/components/BotLibrary/BotSkeleton';
import { BotWithJobs } from '@/types/custom';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getBots } from '@/utils/supabase/queries';

export default function Page() {
  const { bots, loading } = useBots();
  console.log("bots",bots);

  if (loading) {
    return <BotLibrarySkeleton />;
  }

  return <BotLibrary bots={bots} />;
}
