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
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-8 bg-white dark:bg-transparent shadow-[0_4px_6px_-1px_rgba(90,79,207,0.3),0_2px_4px_-2px_rgba(90,79,207,0.2)] bg-card hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] transition-transform border border-border shadow-3xl">
      <CardHeader className="mb-4 relative"> {/* Add relative here */}
        <h1 className="text-2xl font-bold text-primary">
            {job.name}
        </h1>
        <div className="flex flex-col gap-4 mb-4">
          <div className="pt-4 flex items-center space-x-4 text-sm text-primary">
            <span className="flex items-center">
              {job.departments.length > 0
                ? job.departments.map(dept => (
                  <span key={dept.name} className="mr-2 inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-500 bg-input rounded-full">
                    <BriefcaseIcon className="mr-1 h-4 w-4 text-gray-500" /> {dept.name}
                  </span>
                ))            
                : 'missing'}
            </span>

            <span className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4 text-gray-500" />{' '}
              {job.offices.length > 0 ? job.offices.map(office => office.name).join(', ') : 'missing'}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-black">
            <span className="flex items-center">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                job.status === 'Draft' ? 'bg-gray-100 text-primary' :
                'bg-green-100 text-green-800'
              }`}>
                {job.status || 'Active'}
              </div>
            </span>
            {/* Position the "Open for X days" in the top-right */}
            <span className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-2 text-sm text-black group relative">
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
      <CardContent className="border-t border-input space-y-6">
        <section>
          <h3 className="mt-8 text-lg font-semibold flex items-center mb-2">
            <ClipboardListIcon className="mr-2 h-5 w-5 text-gray-500" /> Job
            Description
          </h3>
          <CardDescription className="text-sm leading-7 text-primary/70">
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
