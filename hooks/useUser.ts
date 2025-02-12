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
  user: {
    data: User | null;
    loading: boolean;
    error: Error | null;
  };
  recruiter: {
    data: Recruiter | Applicant | null;
    loading: boolean;
    error: Error | null;
  };
  company: {
    data: Company | null;
    loading: boolean;
    error: Error | null;
  };
  isRecruiter: boolean;
}

export function useUser(): UseUserReturn {
  const supabase = createClient();

  // Fetch authenticated user data
  const {
    data: userData,
    error: userError,
    isLoading: userLoading
  } = useQuery<User | null, Error>({
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
  console.log("userdata in useuser", userData);
  
  // Query to get the user's role (as 'recruiter' or 'applicant')
  const {
    data: role,
    isLoading: roleLoading,
    error: roleError
  } = useQuery<'recruiter' | 'applicant' | null, Error>({
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
  } = useQuery<Recruiter | Applicant | null, Error>({
    queryKey: [isRecruiter ? 'recruiter' : 'applicants', userData?.id],
    enabled: !!userData?.id && !roleLoading, // wait until the role is known
    queryFn: async () => {
      if (!userData?.id) return null;
      if (isRecruiter) {
        console.log("going to recruiters")

        const { data, error } = await supabase
          .from('recruiters')
          .select('*')
          .eq('id', userData.id)
          .single();
        if (error) throw error;
        return data;
      } else {
        console.log("going to applicants")
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
  } = useQuery<Company | null, Error>({
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
  useQuery<void, Error>({
    queryKey: ['authListener'],
    queryFn: async () => {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_event, _session) => {
        // The other queries will automatically re-fetch when needed
      });
      // return () => subscription.unsubscribe();
      return subscription.unsubscribe(); // line changed

    },
    staleTime: Infinity
  });

  return {
    user: {
      data: userData || null,
      loading: userLoading,
      error: userError instanceof Error ? userError : userError ? new Error('Failed to fetch user data') : null
    },
    recruiter: {
      data: recruiterData || null,
      loading: (!!userId && !roleLoading && recruiterLoading) || roleLoading,
      error: (recruiterError || roleError) instanceof Error ? 
        (recruiterError || roleError) : 
        (recruiterError || roleError) ? new Error('Failed to fetch recruiter data') : null
    },
    company: {
      data: companyData || null,
      loading: isRecruiter && !!recruiterRecord?.company_id && companyLoading,
      error: companyError instanceof Error ? companyError : companyError ? new Error('Failed to fetch company data') : null
    },
    isRecruiter
  };
}
