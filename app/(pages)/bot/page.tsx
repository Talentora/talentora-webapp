// import Bot from '@/components/Bot';
// import { Job } from '@/types/merge';

// interface PageProps {
//   searchParams: { jobId?: string };
// }

// export default async function Page({ searchParams }: PageProps) {
//   const jobId = searchParams.jobId;

//   let job: Job | null = null;

//   if (jobId) {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${jobId}`
//     );
//     if (response.ok) {
//       job = await response.json();
//     }
//   }

//   return (
//     <div>
//       <Bot job={job} />
//     </div>
//   );
// }
'use client';
import BotLibrary from '@/components/BotLibrary';
import { Loader2 } from 'lucide-react';
import { useBots } from '@/hooks/useBots';

export default function Page() {
  const { bots, loading } = useBots();

  if (!bots) return null;

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return <BotLibrary bots={bots} />;
}
