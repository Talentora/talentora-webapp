import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BriefcaseIcon, CalendarIcon, CircleDollarSign, MapPinIcon } from "lucide-react";
import { Tables } from "@/types/types_db";
type Job = Tables<'jobs'>;

interface JobHeaderProps {
  job: Job;
  toggleSection: (section: string) => void;
  visible: boolean;
}
export function JobHeader({ job, toggleSection, visible }: JobHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => toggleSection('jobDetails')}>
          {visible ? 'Hide' : 'Show'} Details
        </Button>
      </div>
      <CardDescription>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center"><BriefcaseIcon className="mr-1 h-4 w-4" /> {job.department}</span>
          <span className="flex items-center"><MapPinIcon className="mr-1 h-4 w-4" /> {job.location}</span>
          <span className="flex items-center"><CircleDollarSign className="mr-1 h-4 w-4" /> {job.salary_range}</span>
          {/*<span className="flex items-center"><CalendarIcon className="mr-1 h-4 w-4" /> {job.postedDate}</span>*/}
        </div>
      </CardDescription>
    </CardHeader>
  );
}
