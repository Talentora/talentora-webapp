import { createClient } from '@/utils/supabase/server';
import { getJob, getApplicants } from '@/utils/supabase/queries';
import Job from '@/components/Job';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>

interface JobPageProps {
  params: { id: string };
}

export default async function Page({ params }: JobPageProps) {
  const supabase = createClient();
  const job = await getJob(supabase, Number(params.id));

  if (job) {
    const applicants = await getApplicants(supabase, job.id);

    return (
      <div>
        <Job job={job} applicants={applicants} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Job not found</h1>
      </div>
    );
  }
}