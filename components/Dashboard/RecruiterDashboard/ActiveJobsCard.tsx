import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Navigation, MoreHorizontal } from 'lucide-react';
import { Job } from '@/types/merge';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

export default function ActiveJobsCard({ jobs, isLoading }: { jobs: Job[], isLoading: boolean  }) {

  return (
    <Card className="p-5 -mt-16 bg-white rounded-2xl border border-input shadow-primary-dark/50 bg-card">
      <CardHeader className="flex flex-row ">
        <Link href="/jobs" className="text-lg text-black hover:text-primary">
        <CardTitle className='text-black text-lg dark:text-white'>Active Job Titles</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="p-4 rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-2 w-24" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No jobs available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
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
      <div className="p-4 border border-input rounded-lg hover:bg-input transition-colors duration-200">
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
