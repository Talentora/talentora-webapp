'use client';

import { useQuery } from '@tanstack/react-query';
import { getScouts } from '@/utils/supabase/queries';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentora.io';

export function useSidebarData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });

  const { data: scouts, error: scoutsError, isLoading: scoutsLoading } = useQuery({
    queryKey: ['scouts'],
    queryFn: () => getScouts()
  });

  return {
    jobs: Array.isArray(jobs) ? jobs.slice(0, 3) : [],
    applications: Array.isArray(applications) ? applications.slice(0, 3) : [],
    scouts: Array.isArray(scouts) ? scouts : [],
    isLoading: jobsLoading || applicationsLoading || scoutsLoading,
    isError: jobsError || applicationsError || scoutsError
  };
}