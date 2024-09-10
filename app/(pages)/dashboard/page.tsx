import Dashboard from '@/components/Dashboard';
import { createClient } from '@/utils/supabase/server';
import { getJobs } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';

import { getUser, getUserDetails, getSubscription } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

type Job = Tables<'jobs'>;

const Page = async () => {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }
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
