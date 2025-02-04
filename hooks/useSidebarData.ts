'use client';

import { useQuery } from '@tanstack/react-query';
import { getScouts } from '@/utils/supabase/queries';

export function useSidebarData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs').then((res) => res.json())
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications').then((res) => res.json())
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