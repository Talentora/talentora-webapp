'use client';
import ScoutLibrary from '@/components/ScoutLibrary';
import { useScouts } from '@/hooks/useScouts';
import { ScoutSkeleton } from '@/components/ScoutLibrary/ScoutSkeleton';


export default function Page() {
  const { scouts, loading } = useScouts();
  console.log(`Fetched ${scouts.length} scouts`);

  if (loading) {
    return <ScoutSkeleton />;
  }

  return <ScoutLibrary scouts={scouts} />;
}
