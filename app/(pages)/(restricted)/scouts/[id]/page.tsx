'use client';
import { ScoutInfo } from '@/components/ScoutLibrary/ScoutInfo';
import { Tables } from '@/types/types_db';
type Scout = Tables<'bots'>;
import { useEffect, useState } from 'react';
import { getscoutById } from '@/utils/supabase/queries';
import { ScoutSkeleton } from '@/components/ScoutLibrary/ScoutSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScoutPage({ params }: { params: { id: string } }) {
  const [scout, setScout] = useState<Scout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scoutId = parseInt(params.id);
  const router = useRouter();

  useEffect(() => {
    async function fetchScout() {
      try {
        const scoutData = await getscoutById(scoutId.toString());
        if (!scoutData) {
          setError('Scout not found');
          return;
        }
        setScout(scoutData);
      } catch (err) {
        setError(`Failed to fetch scout, ${err}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (scoutId) {
      fetchScout();
    }
  }, [scoutId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading || !scout) {
    return <ScoutSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/scout')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Scouts
      </Button> */}
      <ScoutInfo scout={scout} />
    </div>
  );
}
