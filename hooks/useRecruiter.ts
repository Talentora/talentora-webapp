import { useState, useEffect } from 'react';
import { getRecruiter } from '@/utils/supabase/queries';
import { useUser } from './useUser';
import { Tables } from '@/types/types_db';

type Recruiter = Tables<'recruiters'>;

export const useRecruiter = () => {
  const { user } = useUser();
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecruiter = async () => {
      if (!user) return;
      try {
        const data = await getRecruiter(user.id);
        setRecruiter(data);
      } catch (err) {
        setError('Failed to fetch recruiter');
        console.error('Error fetching recruiter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, [user]);

  return { recruiter, loading, error };
};
