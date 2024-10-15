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
import { Job } from '@/types/greenhouse';

interface CardViewProps {
  cardViewData: {
    filteredJobs: Job[];
    onDeleteJob: (id: number) => void;
  };
}

export function CardView({ cardViewData }: CardViewProps) {
  const { filteredJobs, onDeleteJob } = cardViewData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="hover:bg-primary-800 p-4 relative">
          <Link href={`./jobs/${job.id}`}>
            <CardHeader>
              <CardTitle>{job.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div>{job.departments.join(', ')}</div>
                <div>{job.offices.join(', ')}</div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {job.openings.length} openings
                </span>
              </div>
            </CardContent>
          </Link>
          <CardFooter className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onDeleteJob(job.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}