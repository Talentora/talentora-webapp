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
  ClipboardListIcon,
  ArrowLeft
} from 'lucide-react';
import { EnrichedJob } from '../JobList';
import { Button } from '@/components/ui/button';
interface JobHeaderProps {
  job: EnrichedJob;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <Card className="w-full max-w-4xl shadow-lg rounded-lg p-4 bg-white">
      <CardHeader className="border-b border-gray-200 mb-4">
        
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <BriefcaseIcon className="mr-1 h-4 w-4 text-gray-500" />{' '}
              {job.departments.length > 0
                ? job.departments.map(dept => dept.name).join(', ')
                : 'missing'}
            </span>
            <span className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4 text-gray-500" />{' '}
              {job.offices.length > 0 ? job.offices.map(office => office.name).join(', ') : 'missing'}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                job.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                'bg-green-100 text-green-800'
              }`}>
                {job.status || 'Active'}
              </div>
            </span>
            <span className="flex items-center group relative">
              <span>
                Open for {Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Posted: {new Date(job.created_at).toLocaleDateString()}
              </div>
            </span>
           
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <ClipboardListIcon className="mr-2 h-5 w-5 text-gray-500" /> Job
            Description
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
