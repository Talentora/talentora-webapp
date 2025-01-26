'use client';

import { useQuery } from '@tanstack/react-query';
import { getBots } from '@/utils/supabase/queries';

export function useSidebarData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs').then((res) => res.json())
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications').then((res) => res.json())
  });

  const { data: bots, error: botsError, isLoading: botsLoading } = useQuery({
    queryKey: ['bots'],
    queryFn: () => getBots()
  });

  

  return {
    jobs: jobs?.slice(0, 3) || [],
    applications: applications?.slice(0, 3) || [],
    bots: bots || [],
    isLoading: jobsLoading || applicationsLoading || botsLoading,
    isError: jobsError || applicationsError || botsError
  };
}