import { useState, useEffect } from 'react';
import { getCompany } from '@/utils/supabase/queries';
import { useRecruiter } from './useRecruiter';
import { Tables } from '@/types/types_db';

type Company = Tables<'companies'>;

export const useCompany = () => {
    const { recruiter } = useRecruiter();
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            if (!recruiter || !recruiter.company_id) {
                return;
            }
            try {
                const data = await getCompany(recruiter.company_id);
                setCompany(data);
            } catch (err) {
                setError('Failed to fetch company');
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [recruiter]);

  return { company };
};
