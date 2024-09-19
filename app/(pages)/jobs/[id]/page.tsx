import Job from '@/components/Job';
import { getJob, getApplicants } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';

interface JobPageProps {
  params: { id: string };
}

export default async function Page({ params }: JobPageProps) {
  const supabase = createClient(); // Ensure this is within the function scope
  const job = await getJob(supabase,Number(params.id));

  if (job) {
    const applicants = await getApplicants(supabase,job.id);
    return (
      <div>
        <Job 
          job={job} 
          applicants={applicants}
        />
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