import Dashboard from '@/components/Dashboard';
import { createClient } from '@/utils/supabase/server';
import { getJobs } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

const Page = async () => {
  const supabase = createClient();
  let jobs: Job[] = [];

  try {
    jobs = await getJobs(supabase);
    // console.log("jobs", jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  return (
    <div>
      {jobs && jobs.length > 0 ? (
        <Dashboard jobs={jobs} />
      ) : (
        <h1>Error fetching jobs or no jobs available</h1>
      )}
    </div>
  );
};

export default Page;
