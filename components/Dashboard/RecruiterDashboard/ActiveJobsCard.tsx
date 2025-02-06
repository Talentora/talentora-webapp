import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { Job } from '@/types/merge';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ActiveJobsCard({ jobs, isLoading }: { jobs: Job[], isLoading: boolean }) {
  return (
    <Card className="p-5 border border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 
        dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]  
        hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] 
        overflow-hidden">
      
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl">Active Job Titles</CardTitle>
        <Link href="/jobs" className="text-md hover:text-primary">
          <p className="text-md text-primary font-semibold">View All</p>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="p-4 border border-input rounded-lg flex flex-col space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-24" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-lg">
            <p className="text-sm text-muted-foreground">No jobs available.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <JobItem key={job.id} job={job} />
            ))}
            {jobs.length > 5 && <MoreJobsLink count={jobs.length - 5} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function JobItem({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="group">
      <div className="p-5 bg-background rounded-2xl shadow-md transition duration-300 ease-in-out 
          hover:shadow-xl flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="truncate">
            <h3 className="font-semibold text-md hover:text-primary mb-1">{job.name}</h3>
            <div className="pt-2 text-xs text-gray-500 flex flex-wrap gap-2">
              {Array.isArray(job.departments) && job.departments.length > 0 ? (
                job.departments.slice(0, 3).map((dept, index) => (
                  <Badge key={index} className={`font-normal ${getBadgeColor(index)}`}>
                    {typeof dept === 'object' ? dept.name : dept}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400">No departments</span>
              )}
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-700">0 Applicants</p>
        </div>
      </div>
    </Link>
  );
}

function MoreJobsLink({ count }: { count: number }) {
  return (
    <Link href="/jobs">
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 
          flex items-center justify-center">
        <Navigation className="h-4 w-4 mr-2" />
        <span className="text-md font-medium">
          View {count} more job{count !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}

// Helper function for badge colors
function getBadgeColor(index: number) {
  const colors = [
    'border border-blue-600 bg-blue-500/20 text-blue-600', // Blue
    'border border-purple-600 bg-purple-500/20 text-purple-600', // Purple
    'border border-pink-600 bg-pink-500/20 text-pink-500', // Pink
  ];
  return colors[index % colors.length];
}
