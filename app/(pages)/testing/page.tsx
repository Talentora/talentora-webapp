import { createClient } from '@/utils/supabase/server';
import { getJobs } from '@/utils/supabase/queries';
export default async function Home() {
  const supabase = createClient();

  const jobs = await getJobs(supabase);

  return (
    <div>
      <h1>Hello World</h1>
      <p>{JSON.stringify(jobs)}</p>
    </div>
  );
}
