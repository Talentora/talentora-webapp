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
"use client"
import BotLibrary from '@/components/BotLibrary';
import { createClient } from '@/utils/supabase/client';
import { useState,useEffect } from 'react';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;
import { getBots } from '@/utils/supabase/queries';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const supabase = createClient();
  const [bots,setBots] = useState<Bot[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

  useEffect(()=> {
    const fetchBots = async () => {
      const bots = await getBots();
      if (bots) {
        setBots(bots);
      }
      setLoading(false);
    };
    fetchBots();
  }, []);

  if (!bots) return null;

  if (loading) return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;

  return <BotLibrary bots={bots} />;
}
