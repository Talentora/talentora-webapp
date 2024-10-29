import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Navigation, MoreHorizontal } from 'lucide-react';
import { Job } from '@/types/merge';

export default function ActiveJobsCard({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="p-5 border border-gray-300 rounded-lg shadow-sm relative">
      <CardHeader>
        <CardTitle>Active Job Titles</CardTitle>
        <Link href="/jobs">
          <Button
            className="bg-[#5650F0] text-white hover:bg-[#4a45d1] flex items-center absolute top-4 right-4"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create a Job
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No jobs available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {jobs?.slice(0, 5).map((job, index) => (
              <JobItem key={index} job={job} />
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
    <Link href={`/jobs/${job.id}`}>
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <h3 className="font-semibold text-sm mb-1 truncate">{job.name}</h3>
        <p className="text-xs text-gray-500 mb-2 truncate">
          {job.departments.slice(0, 3).map((dept, index) => (
            <span key={index}>
              {dept}
              {index < Math.min(job.departments.length, 3) - 1 && ', '}
            </span>
          ))}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-blue-100 text-red-500 px-2 py-1 rounded-full">
            Update
          </span>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

function MoreJobsLink({ count }: { count: number }) {
  return (
    <Link href="/jobs" className="col-span-2">
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
        <Navigation className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          View {count} more job{count !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}
