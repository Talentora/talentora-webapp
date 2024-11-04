import { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/supabase/queries';
import { useUser } from './useUser';
import { Tables } from '@/types/types_db';

type Subscription = Tables<'subscriptions'>;

export const useSubscription = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        return;
      }
      try {
        const data = await getSubscription();
        setSubscription(data);
      } catch (err) {
        setError('Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading, error };
};
