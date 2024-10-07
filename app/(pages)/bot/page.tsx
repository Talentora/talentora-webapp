import Bot from '@/components/Bot';
import { getJob } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { Tables } from '@/types/types_db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Import missing components

type Job = Tables<'jobs'>;

interface PageProps {
  searchParams: { jobId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const jobId = searchParams.jobId;
  const supabase = createClient();

  let job: Job | null = null;

  if (jobId) {
    job = await getJob(supabase, jobId);
  }

  return (
    <div>
      <Bot job={job} />
    </div>
  );
}
