import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Navigation, MoreHorizontal, Loader2 } from 'lucide-react';
import { Job } from '@/types/merge';
import { useState, useEffect } from 'react';

export default function ActiveJobsCard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const jobsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`
      );
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Card className="p-5 border border-gray-300 bg-foreground rounded-lg shadow-sm relative col-span-2">
      <CardHeader>
        w<CardTitle>Active Job Titles</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No jobs available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {jobs
              ?.slice(0, 5)
              .map((job, index) => <JobItem key={index} job={job} />)}
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
          {Array.isArray(job.departments)
            ? job.departments.slice(0, 3).map((dept: any, index: number) => (
                <span key={index}>
                  {typeof dept === 'object' ? dept.name : dept}
                  {index < Math.min(job.departments.length, 3) - 1 && ', '}
                </span>
              ))
            : 'No departments'}
        </p>
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
