import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/types_db';
import { getBots } from '@/utils/supabase/queries';
import { BotWithJobs } from '@/types/custom';

export const useBots = () => {
  const [bots, setBots] = useState<BotWithJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // State to store error message

  console.log("loading",loading)
  useEffect(() => {
    const fetchBots = async () => {
      // const data = await getBots();

      // if (data) {
      //   setBots(data);
      //   setLoading(false);
      //   return;
      // }
      // setLoading(false);
      try {
        const data = await getBots();
        
        if (data) {
          setBots(data);
        } else {
          setError('No bots found');  // Optional: Customize your error message
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching bots');  // Handle any errors
      } finally {
        setLoading(false);  // Set loading to false whether success or error
      }

    };

    fetchBots();
  }, []);

  return { bots, loading, error };
};
