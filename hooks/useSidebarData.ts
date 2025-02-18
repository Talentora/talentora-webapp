'use client';

import { useQuery } from '@tanstack/react-query';
import { getScouts } from '@/utils/supabase/queries';
import { getURL } from '@/utils/helpers';

export function useSidebarData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading, isFetched: jobsFetched } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch(getURL('api/jobs'), {
        credentials: 'include', // Include cookies for auth
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Jobs fetch failed: ${response.status}`);
      }
      
      return response.json();
    }
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading, isFetched: applicationsFetched } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await fetch(getURL('api/applications'), {
        credentials: 'include', // Include cookies for auth
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Applications fetch failed: ${response.status}`);
      }
      
      return response.json();
    }
  });

  const { data: scouts, error: scoutsError, isLoading: scoutsLoading, isFetched: scoutsFetched } = useQuery({
    queryKey: ['scouts'],
    queryFn: () => getScouts()
  });

  // console.log('jobs: ', jobs)
  // console.log('applications: ', applications)

  return {
    jobs: Array.isArray(jobs) ? jobs.slice(0, 3) : [],
    applications: Array.isArray(applications) ? applications.slice(0, 3) : [],
    scouts: Array.isArray(scouts) ? scouts : [],
    isLoading: jobsLoading || applicationsLoading || scoutsLoading,
    isError: jobsError || applicationsError || scoutsError,
    isInitialized
  };
}