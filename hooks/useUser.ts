'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { type Database } from '@/types/types_db';

type Recruiter = Database['public']['Tables']['recruiters']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

interface UseUserReturn {
  user: User | null;
  recruiter: Recruiter | null; 
  company: Company | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserReturn {
  const supabase = createClient();

  const { data: userData, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const { data: recruiterData, error: recruiterError, isLoading: recruiterLoading } = useQuery({
    queryKey: ['recruiter', userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      if (!userData?.id) return null;
      const { data, error } = await supabase
        .from('recruiters')
        .select('*')
        .eq('id', userData.id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: companyData, error: companyError, isLoading: companyLoading } = useQuery({
    queryKey: ['company', recruiterData?.company_id],
    enabled: !!recruiterData?.company_id,
    queryFn: async () => {
      if (!recruiterData?.company_id) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', recruiterData.company_id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  // Set up auth state listener
  useQuery({
    queryKey: ['authListener'],
    queryFn: async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          // The other queries will automatically re-fetch when needed
          // due to their query key dependencies
        }
      );
      return () => subscription.unsubscribe();
    },
    staleTime: Infinity // Prevent unnecessary refetches of the auth listener
  });

  const error = userError || recruiterError || companyError || null;
  const loading = userLoading || recruiterLoading || companyLoading;

  return {
    user: userData || null,
    recruiter: recruiterData || null,
    company: companyData || null,
    loading,
    error: error instanceof Error ? error : error ? new Error('Failed to fetch data') : null
  };
}
