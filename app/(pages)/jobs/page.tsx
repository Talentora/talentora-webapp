import Dashboard from '@/components/Jobs';
import { getJobs, deleteJob } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type Job = Tables<'jobs'>;

const Page = async () => {
 
  const supabase = createClient();
  const jobs = await getJobs(supabase);

  return (
    <div>
      {jobs && jobs.length > 0 ? (
        <Dashboard jobs={jobs}  />
      ) : (
        <h1>Error fetching jobs or no jobs available</h1>
      )}
    </div>
  );
};

export default Page;
