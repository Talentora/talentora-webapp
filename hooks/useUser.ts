'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { type Database } from '@/types/types_db';
import { getUserRole } from '@/utils/supabase/queries';

type Recruiter = Database['public']['Tables']['recruiters']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type Applicant = Database['public']['Tables']['applicants']['Row'];

interface UseUserReturn {
  user: User | null;
  recruiter: Recruiter | Applicant | null;
  company: Company | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserReturn {
  const supabase = createClient();

  // Fetch authenticated user data
  const {
    data: userData,
    error: userError,
    isLoading: userLoading
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const userId = userData?.id ?? '';

  // Query to get the user's role (as 'recruiter' or 'applicant')
  const {
    data: role,
    isLoading: roleLoading,
    error: roleError
  } = useQuery({
    queryKey: ['userRole', userId],
    enabled: !!userId,
    queryFn: async () => await getUserRole(supabase, userId)
  });

  // Derive the boolean from the role
  const isRecruiter = role === 'recruiter';

  // Fetch recruiter data or applicant data based on the user's role
  const {
    data: recruiterData,
    error: recruiterError,
    isLoading: recruiterLoading
  } = useQuery({
    queryKey: [isRecruiter ? 'recruiter' : 'applicants', userData?.id],
    enabled: !!userData?.id && !roleLoading, // wait until the role is known
    queryFn: async () => {
      if (!userData?.id) return null;
      if (isRecruiter) {
        const { data, error } = await supabase
          .from('recruiters')
          .select('*')
          .eq('id', userData.id)
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', userData.id)
          .single();
        if (error) throw error;
        return data;
      }
    }
  });

  const recruiterRecord: Recruiter | null =
    isRecruiter && recruiterData && 'company_id' in recruiterData
      ? (recruiterData as Recruiter)
      : null;

  // Fetch company data if recruiter exists and has a company_id
  const {
    data: companyData,
    error: companyError,
    isLoading: companyLoading
  } = useQuery({
    queryKey: ['company', recruiterRecord?.company_id],
    enabled: !!recruiterRecord?.company_id,
    queryFn: async () => {
      if (!recruiterRecord?.company_id) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', recruiterRecord.company_id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  // Optional: Set up an auth state listener
  useQuery({
    queryKey: ['authListener'],
    queryFn: async () => {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_event, _session) => {
        // The other queries will automatically re-fetch when needed
      });
      return () => subscription.unsubscribe();
    },
    staleTime: Infinity
  });

  // Combine errors and loading states
  const error = userError || roleError || recruiterError || companyError || null;
  const loading = userLoading || roleLoading || recruiterLoading || companyLoading;

  if (recruiterRecord == null) {
    return {
      user: userData || null,
      recruiter: null,
      company: null,
      loading,
      error: error instanceof Error ? error : error ? new Error('Failed to fetch data') : null
    };
  } else {
    return { 
      user: userData || null,
      recruiter: recruiterData || null,
      company: companyData || null,
      loading,
      error: error instanceof Error ? error : error ? new Error('Failed to fetch data') : null
    };
  }
}
