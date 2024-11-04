import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card
} from '@/components/ui/card';
import {
  BriefcaseIcon,
  MapPinIcon,
  CircleDollarSign,
  ClipboardListIcon
} from 'lucide-react';
import { Job } from '@/types/merge';

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <Card className="w-full max-w-4xl shadow-lg rounded-lg p-4 bg-white">
      <CardHeader className="border-b border-gray-200 mb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">{job.name}</CardTitle>
        <div className="flex flex-row justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <BriefcaseIcon className="mr-1 h-4 w-4 text-gray-500" />{' '}
              {job.departments.length > 0
                ? job.departments.join(', ')
                : 'missing'}
            </span>
            <span className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4 text-gray-500" />{' '}
              {job.offices.length > 0 ? job.offices.join(', ') : 'missing'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <ClipboardListIcon className="mr-2 h-5 w-5 text-gray-500" /> Job Description
          </h3>
          <CardDescription className="text-gray-600">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: job.description || 'missing' }}
            />
          </CardDescription>
        </section>
      </CardContent>
    </Card>
  );
}
