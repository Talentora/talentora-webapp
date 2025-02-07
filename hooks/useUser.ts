'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { type Database } from '@/types/types_db';

type Recruiter = Database['public']['Tables']['recruiters']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type Applicant = Database['public']['Tables']['applicants']['Row'];

/**
 * Hook to manage user authentication and related data
 * @returns {UseUserReturn} Object containing user, recruiter (or applicant) data, company data and loading/error states
 */
interface UseUserReturn {
  /** The authenticated Supabase user */
  user: SupabaseUser | null;
  /** Recruiter or applicant data if user exists */
  recruiter: Recruiter | Applicant | null;
  /** Company data if user is associated with a company */
  company: Company | null;
  /** Loading state for any data fetching */
  loading: boolean;
  /** Any error that occurred during data fetching */
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

  // Determine if the user is a recruiter based on the identity data
  const isRecruiter =
    userData?.identities?.[0]?.identity_data?.role === 'recruiter';

  // Fetch recruiter data or applicant data (if not a recruiter) based on the user's role
  const {
    data: recruiterData,
    error: recruiterError,
    isLoading: recruiterLoading
  } = useQuery({
    queryKey: [isRecruiter ? 'recruiter' : 'applicants', userData?.id],
    enabled: !!userData?.id,
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
  

  // Fetch company data if recruiter exists and has company_id
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
  

  // Set up auth state listener to keep data in sync
  useQuery({
    queryKey: ['authListener'],
    queryFn: async () => {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_event, _session) => {
        // The other queries will automatically re-fetch when needed
        // due to their query key dependencies
      });
      return () => subscription.unsubscribe();
    },
    staleTime: Infinity // Prevent unnecessary refetches of the auth listener
  });

  // Combine errors and loading states
  const error = userError || recruiterError || companyError || null;
  const loading = userLoading || recruiterLoading || companyLoading;

  if (recruiterRecord == null) { // is an applicant
    return {
      user: userData || null,
      recruiter: null,
      company: null,
      loading,
      error:
        error instanceof Error ? error : error ? new Error('Failed to fetch data') : null
    };
  } else {

    return { 
      user: userData || null,
      recruiter: recruiterData || null,
      company: companyData || null,
      loading,
      error:
        error instanceof Error ? error : error ? new Error('Failed to fetch data') : null
    };
  }
}