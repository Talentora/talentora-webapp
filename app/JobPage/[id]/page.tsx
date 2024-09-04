"use client"

import JobPage from "@/components/JobPage";
import { getJob } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const job = await fetchJobData(params.id);

  console.log("job",job);

  return (
    <div>
      {job ? <JobPage job={job} /> : <p>Job not found</p>}
    </div>
  );
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
