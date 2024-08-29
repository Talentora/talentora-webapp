import JobPage from "@/components/JobPage";
import { getJob } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const job = await fetchJobData(params.id);

  console.log("job",job);

  if (job) {
    return (
      <div>
        <JobPage job={job} />
      </div>
    );
  }
  else {
    return (
      <div>
        <h1>Job not found</h1>
      </div>
    );
  }

}

async function fetchJobData(id: string) {
  const supabase = createClient();
  let job = null;

  try {
    job = await getJob(supabase, id);
  } catch (error) {
    console.error("Error fetching job:", error);
  }

  return job;
}
