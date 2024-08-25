import Dashboard from "@/components/Dashboard";
import { createClient } from '@/utils/supabase/server';
import { getJobs } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

const page = async () => {
  const supabase = createClient();
  const jobs: Job[] = await getJobs(supabase);

  console.log("jobs",jobs)

  return (
    <div>
      <Dashboard jobs={jobs} />
    </div>
  );
}

export default page;
