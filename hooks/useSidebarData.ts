import { useQuery } from '@tanstack/react-query';
import { fetchJobsData } from '@/server/jobs';
import { fetchScoutsData } from '@/server/scouts';
import { fetchAllApplications } from '@/server/applications';

export function useSidebarData() {
  // First, get the company ID using a query


  const { data: jobs, error: jobsError, isLoading: jobsLoading, isFetched: jobsFetched } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobsData
  });

  // const { data: applications, error: applicationsError, isLoading: applicationsLoading, isFetched: applicationsFetched } = useQuery({
  //   queryKey: ['applications'],
  //   queryFn: fetchAllApplications
  // });

  const { data: scouts, error: scoutsError, isLoading: scoutsLoading, isFetched: scoutsFetched } = useQuery({
    queryKey: ['scouts'],
    queryFn: fetchScoutsData
  });

  // const isInitialized = jobsFetched && applicationsFetched && scoutsFetched;
  const isInitialized = jobsFetched && scoutsFetched;


  return {
    jobs: Array.isArray(jobs) ? jobs.slice(0, 3) : [],
    // applications: Array.isArray(applications) 
    //   ? applications
    //       .filter(app => app.ai_summary)
    //       .slice(0, 3)
    //   : [],
    scouts: (Array.isArray(scouts) ? scouts : []) || scoutsLoading,
    isLoading: jobsLoading || scoutsLoading,
    isError: jobsError || scoutsError,
    isInitialized
  };
}