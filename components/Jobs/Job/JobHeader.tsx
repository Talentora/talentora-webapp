import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card
} from '@/components/ui/card';
import {
  MapPinIcon,
  ClipboardListIcon,
  ChevronDown
} from 'lucide-react';
import { EnrichedJob } from '../types';
import { useState } from 'react';
import DepartmentChips from '@/components/Jobs/DepartmentChips';

interface JobHeaderProps {
  job: EnrichedJob;
}

export function JobHeader({ job }: JobHeaderProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  console.log(job, "job");

  return (
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-4 dark:bg-transparent border border-border">
      <CardHeader className="mb-4 relative">
        <CardTitle className="text-2xl font-bold text-foreground">{job.name}</CardTitle>
        <div className="flex flex-col gap-4 mb-4">
          <div className="pt-4 flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <DepartmentChips departments={job.departments} />
            </span>
            <span className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4 text-gray-500" /> {job.offices && job.offices.length > 0 ? job.offices.map((office: any) => office.name).join(', ') : 'missing'}
            </span>
            <span className="flex items-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'Closed' ? 'bg-red-100 text-red-800' : job.status === 'Draft' ? 'bg-gray-100 text-primary' : 'bg-green-100 text-green-800'}`}>
                {job.status || 'Active'}
              </div>
            </span>
            <span className="flex items-center space-x-2 text-sm flex-col">
              <p>Posted</p>
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="border-t border-input space-y-6">
        <section>
          <div className="flex items-center justify-between cursor-pointer" onClick={toggleDescription}>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <ClipboardListIcon className="mr-2 h-5 w-5 text-gray-500" /> Job Description
            </h3>
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-200 ${
                isDescriptionOpen ? 'rotate-180' : ''
              }`}
            />
          </div>

          {isDescriptionOpen && (
            <CardDescription className="text-sm leading-7 text-primary/70 mt-4">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: job.description || 'missing' }}
              />
            </CardDescription>
          )}
        </section>
      </CardContent>
    </Card>
  );
}