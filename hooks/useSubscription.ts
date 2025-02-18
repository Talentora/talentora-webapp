'use client';

import { useState, useEffect } from 'react';
import { getSubscription } from '@/utils/supabase/queries';
import { useUser } from './useUser';
import { Tables } from '@/types/types_db';

export function useSubscription() {
  const { user: { data: user } } = useUser();
  const [subscription, setSubscription] = useState<Tables<'subscriptions'> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
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
}
