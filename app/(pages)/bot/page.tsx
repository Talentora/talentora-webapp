import Bot from '@/components/Bot';
import { Job } from '@/types/greenhouse';

interface PageProps {
  searchParams: { jobId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const jobId = searchParams.jobId;

  let job: Job | null = null;

  if (jobId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs/${jobId}`
    );
    if (response.ok) {
      job = await response.json();
    }
  }

  return (
    <div>
      <Bot job={job} />
    </div>
  );
}
