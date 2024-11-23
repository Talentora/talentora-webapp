'use client';

import { useState, useEffect } from 'react';
import { getCompany } from '@/utils/supabase/queries';
import { useRecruiter } from './useRecruiter';
import { Tables } from '@/types/types_db';

type Company = Tables<'companies'>; // Ensure Tables<'companies'> is correctly defined

interface UseCompanyReturn {
  company: Company | null;
  loading: boolean;
  error: Error | null;
}

export const useCompany = (): UseCompanyReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Data from the useRecruiter hook
  const { recruiter, loading: recruiterLoading } = useRecruiter();

  useEffect(() => {
    const fetchCompany = async () => {
      // Guard clause to prevent unnecessary requests
      if (!recruiter?.company_id) {
        setLoading(false);
        return;
      }

      try {
        const companyData = await getCompany(recruiter.company_id);

        if (!companyData) {
          throw new Error('No company found');
        }

        // Safely cast to the Company type
        setCompany(companyData as Company);
      } catch (err) {
        // Handle any unexpected errors
        const errorInstance = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(errorInstance);
        console.error('Error fetching company:', errorInstance);
      } finally {
        // Ensure loading is stopped regardless of outcome
        setLoading(false);
      }
    };

    // Wait for recruiterLoading to complete before making API requests
    if (!recruiterLoading) {
      fetchCompany();
    }
  }, [recruiter?.company_id, recruiterLoading]);

  return {
    company,
    loading: loading || recruiterLoading,
    error,
  };
};
