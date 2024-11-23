'use client';

import { useState, useEffect } from 'react';
import { getRecruiter } from '@/utils/supabase/queries';
import { useUser } from './useUser';
import { Tables } from '@/types/types_db';

// Define the Recruiter type using the database schema
interface Recruiter extends Tables<'recruiters'> {
  id: string;
  user_id: string;
  company_id: string;
  name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseRecruiterReturn {
  recruiter: Recruiter | null;
  loading: boolean;
  error: Error | null;
}

export function useRecruiter(): UseRecruiterReturn {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchRecruiter = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const recruiterData = await getRecruiter(user.id);
        if (!recruiterData) {
          throw new Error('No recruiter found');
        }
        // Ensure the data matches our Recruiter type
        setRecruiter(recruiterData as Recruiter);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recruiter'));
        console.error('Error fetching recruiter:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchRecruiter();
    }
  }, [user?.id, userLoading]);

  return { 
    recruiter, 
    loading: loading || userLoading,
    error 
  };
}
