import Bot from "@/components/Bot";
import { getJob } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/types_db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import missing components

type Job = Tables<'jobs'>;

interface PageProps {
  searchParams: { jobId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const jobId = searchParams.jobId;
  const supabase = createClient();

  let job: Job | null = null;

  if (jobId) {
    job = await getJob(supabase, parseInt(jobId, 10));
  }

  return (
    <div>
      <Card className="job-info p-4 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="job-info__title text-2xl font-bold mb-4">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="job-info__details grid grid-cols-2 gap-4">
          <div>
            <p className="text-lg"><strong>ID:</strong> {job?.id || "Missing ID"}</p>
            <p className="text-lg"><strong>Title:</strong> {job?.title || "Missing Job"}</p>
          </div>
          <div>
            <p className="text-lg"><strong>Requirements:</strong> {job?.requirements || "Missing Requirements"}</p>
            <p className="text-lg"><strong>Qualifications:</strong> {job?.qualifications || "Missing Qualifications"}</p>
          </div>
        </CardContent>
      </Card>
      <Bot job={job} />
    </div>
  );
}