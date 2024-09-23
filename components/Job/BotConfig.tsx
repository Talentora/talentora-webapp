import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Tables } from '@/types/types_db';
import Link from 'next/link';

type Job = Tables<'jobs'>;

interface RoboRecruiterConfigProps {
  job: Job;
}

export function RoboRecruiterConfig({ job }: RoboRecruiterConfigProps) {
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
            href={`/jobs/${job.id}/settings`}
            className="w-full bg-primary-dark p-5 rounded-2xl block text-center text-foreground"
          >
            Customize Your RoboRecruiter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
