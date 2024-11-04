import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/types_db';

type Bot = Tables<'bots'>;

export const useBots = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('bots').select('*');

      if (error) {
        setError(error.message);
      } else {
        setBots(data);
      }
      setLoading(false);
    };

    fetchBots();
  }, []);

  return { bots, loading, error };
};