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
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
        <CardView
          filteredJobs={filteredJobs}
          onCardClick={(jobId) => router.push(`./JobPage/${jobId}`)}
        />
      ) : (
        <TableView
          filteredJobs={filteredJobs}
          onRowClick={(jobId) => router.push(`./JobPage/${jobId}`)}
        />
      )}
    </>
  );
}

interface CardViewProps {
  filteredJobs: Job[];
  onCardClick: (id: number) => void;
}

interface TableViewProps {
  filteredJobs: Job[];
  onRowClick: (id: number) => void;
}

function CardView({ filteredJobs, onCardClick }: CardViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      {filteredJobs.map((job) => (
        <Card
          key={job.id}
          onClick={() => onCardClick(job.id)}
          className="hover:bg-primary-800"
        >
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
            {/*<Badge variant={job.status === 'Active' ? 'default' : job.status === 'Closed' ? 'secondary' : 'outline'}>*/}
            {/*  {job.status}*/}
            {/*</Badge>*/}
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
      ))}
    </div>
  );
}

function TableView({ filteredJobs, onRowClick }: TableViewProps) {
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
          <TableRow
            key={job.id}
            onClick={() => onRowClick(job.id)}
            className="hover:bg-primary-800"
          >
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.department}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>{job.applicant_count}</TableCell>
            {/*<TableCell>*/}
            {/*  <Badge variant={job.status === 'Active' ? 'default' : job.status === 'Closed' ? 'secondary' : 'outline'}>*/}
            {/*    {job.status}*/}
            {/*  </Badge>*/}
            {/*</TableCell>*/}
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
        ))}
      </TableBody>
    </Table>
  );
}
