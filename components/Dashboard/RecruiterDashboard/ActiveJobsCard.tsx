import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Navigation, MoreHorizontal } from 'lucide-react';
import { Job } from '@/types/merge';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component

export default function ActiveJobsCard({ jobs, isLoading }: { jobs: Job[], isLoading: boolean  }) {

  return (
    <Card className="p-5 border border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]  hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="ml-4 text-xl">Active Job Titles</CardTitle>
        <Link href="/jobs" className="text-sm hover:text-primary">
          <p className="text-md mt-2 pr-4 text-primary font-semibold">View All</p>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Job list content here */}
        {isLoading ? (
          <div className="gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="p-4 border border-input rounded-lg">
                <Skeleton className="h-4 w-32 mb-8" />
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
          <div className="gap-4 ">
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
  const applicantCount = 0; // You should replace this with the actual applicant count data

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group p-5 bg-background rounded-2xl shadow-md mb-4 shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:shadow-xl  hover:shadow-[#5650F0]/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1 truncate">{job.name}</h3>
            <p className="pt-2 text-xs text-gray-500 mb-2 truncate">
              {Array.isArray(job.departments)
                ? job.departments.slice(0, 3).map((dept: any, index: number) => (
                    <Badge key={index} className={`font-normal mr-2 ${getBadgeColor(index)}`}>{typeof dept === 'object' ? dept.name : dept}</Badge>
                  ))
                : 'No departments'}
            </p>
          </div>
          {/* Displaying the applicant count without a background */}
          <p className="text-xs font-semibold text-gray-700">{applicantCount} Applicants</p>
        </div>
      </div>
    </Link>
  );
}


// Helper function to get different colors for badges (Blue, Purple, Pink-based)
function getBadgeColor(index: number) {
  const colors = [
    'border border-blue-600 bg-blue-500/20 text-blue-600', // Blue
    'border border-purple-600 bg-purple-500/20 text-purple-600', // Purple
    'border border-pink-600 bg-pink-500/20 text-pink-500', // Pink
  ];
  return colors[index % colors.length]; // Cycle through colors if there are more than 3 departments
}

function MoreJobsLink({ count }: { count: number }) {
  return (
    <Link href="/jobs" className="col-span-2">
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
        <Navigation className="h-4 w-4 mt-4 mr-2" />
        <span className="text-sm font-medium">
          View {count} more job{count !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}
