import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UsersIcon, MoreVerticalIcon } from 'lucide-react';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>

interface CardViewProps {
  filteredJobs: Job[];
}

export function CardView({ filteredJobs }: CardViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      {filteredJobs.map((job) => (
        <Link key={job.id} href={`./jobs/${job.id}`}>
          <Card className="hover:bg-primary-800 p-4">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div>{job.department}</div>
                <div>{job.location}</div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {job.applicant_count} applicants
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}