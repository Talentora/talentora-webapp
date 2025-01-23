'use client';
import ScoutLibrary from '@/components/ScoutLibrary';
import { useScouts } from '@/hooks/useScouts';
import { ScoutSkeleton } from '@/components/ScoutLibrary/ScoutSkeleton';
import { ScoutWithJobs } from '@/types/custom';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getScoutsWithJobIds } from '@/utils/supabase/queries';

export default function Page() {
  const { scouts, loading } = useScouts();

  if (loading) {
    return <ScoutSkeleton />;
  }

  return <ScoutLibrary scouts={scouts} />;
}
