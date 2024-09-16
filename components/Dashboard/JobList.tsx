'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  UsersIcon,
  MoreVerticalIcon,
  LayoutGridIcon,
  ListIcon
} from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;

interface JobListProps {
  filteredJobs: Job[];
  isCardView: boolean;
  toggleView: () => void;
}

export default function JobList({
  filteredJobs,
  isCardView,
  toggleView
}: JobListProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <LayoutGridIcon className="h-4 w-4" />
        <Switch
          checked={!isCardView}
          onCheckedChange={toggleView}
          id="view-toggle"
        />
        <ListIcon className="h-4 w-4" />
        <label htmlFor="view-toggle" className="text-sm text-muted-foreground">
          {isCardView ? 'Card View' : 'Table View'}
        </label>
      </div>
      {isCardView ? (
        <CardView filteredJobs={filteredJobs} />
      ) : (
        <TableView filteredJobs={filteredJobs} />
      )}
    </>
  );
}

interface CardViewProps {
  filteredJobs: Job[];
}

interface TableViewProps {
  filteredJobs: Job[];
}

function CardView({ filteredJobs }: CardViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      {filteredJobs.map((job) => (
        <Link key={job.id} href={`./JobPage/${job.id}`}>
          <Card className="hover:bg-primary-800">
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

function TableView({ filteredJobs }: TableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Applicants</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredJobs.map((job) => (
          <Link key={job.id} href={`./JobPage/${job.id}`}>
            <TableRow className="hover:bg-primary-800">
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.applicant_count}</TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          </Link>
        ))}
      </TableBody>
    </Table>
  );
}
