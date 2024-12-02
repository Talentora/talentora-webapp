import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/types_db';
import { getBots } from '@/utils/supabase/queries';
import { BotWithJobs } from '@/types/custom';

export const useBots = () => {
  const [bots, setBots] = useState<BotWithJobs[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("loading",loading)
  useEffect(() => {
    const fetchBots = async () => {
      const data = await getBots();

      if (data) {
        setBots(data);
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    fetchBots();
  }, []);

  return { bots, loading };
};
