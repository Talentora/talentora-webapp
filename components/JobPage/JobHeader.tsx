import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BriefcaseIcon,
  CalendarIcon,
  CircleDollarSign,
  MapPinIcon
} from 'lucide-react';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
      <CardDescription>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <BriefcaseIcon className="mr-1 h-4 w-4" /> {job.department}
          </span>
          <span className="flex items-center">
            <MapPinIcon className="mr-1 h-4 w-4" /> {job.location}
          </span>
          <span className="flex items-center">
            <CircleDollarSign className="mr-1 h-4 w-4" /> {job.salary_range}
          </span>
          {/*<span className="flex items-center"><CalendarIcon className="mr-1 h-4 w-4" /> {job.postedDate}</span>*/}
        </div>
      </CardDescription>
    </CardHeader>
  );
}