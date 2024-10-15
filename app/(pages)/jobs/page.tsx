import Dashboard from '@/components/Jobs';
// import { getJobs, deleteJob } from '@/utils/supabase/queries';
// import { Tables } from '@/types/types_db';
// import { createClient } from '@/utils/supabase/server';
// import { revalidatePath } from 'next/cache';

// type Job = Tables<'jobs'>;

const Page = async () => {
  // const supabase = createClient();
  // const jobs = await getJobs(supabase);

  // Use absolute URL for server-side fetching
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`, { cache: 'no-store' });
  const jobs = await response.json();
  console.log('jobs', jobs);

  return (
    <div>
      <Dashboard jobs={jobs} />
    </div>
  );
};

export default Page;
