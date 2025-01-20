'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading } = useSWR('/api/jobs', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading } = useSWR('/api/applications', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return {
    jobs: jobs?.slice(0, 3) || [],
    applications: applications?.slice(0, 3) || [],
    isLoading: jobsLoading || applicationsLoading,
    isError: jobsError || applicationsError
  };
} 