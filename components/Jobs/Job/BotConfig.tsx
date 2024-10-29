import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Job } from '@/types/greenhouse';
import Link from 'next/link';

interface BotConfigProps {
  job: Job;
}

export function BotConfig({ job }: BotConfigProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Job Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Link
            href={{
              pathname: `/jobs/${job.id}/settings`,
              query: { job: JSON.stringify(job) }
            }}
            className="w-full bg-primary-dark p-5 rounded-2xl block text-center text-foreground"
          >
            Customize Your Bot
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
