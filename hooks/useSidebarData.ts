import { useQuery } from '@tanstack/react-query';
import { fetchJobsData } from '@/server/jobs';
import { fetchApplicationsData } from '@/server/applications';
import { fetchScoutsData } from '@/server/scouts';

export function useSidebarData() {
  const { data: jobs, error: jobsError, isLoading: jobsLoading, isFetched: jobsFetched } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobsData
  });

  const { data: applications, error: applicationsError, isLoading: applicationsLoading, isFetched: applicationsFetched } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplicationsData
  });

  const { data: scouts, error: scoutsError, isLoading: scoutsLoading, isFetched: scoutsFetched } = useQuery({
    queryKey: ['scouts'],
    queryFn: fetchScoutsData
  });

  const isInitialized = jobsFetched && applicationsFetched && scoutsFetched;

  return {
    jobs: Array.isArray(jobs) ? jobs.slice(0, 3) : [],
    applications: Array.isArray(applications) ? applications.slice(0, 3) : [],
    scouts: Array.isArray(scouts) ? scouts : [],
    isLoading: jobsLoading || applicationsLoading || scoutsLoading,
    isError: jobsError || applicationsError || scoutsError,
    isInitialized
  };
}