import { EnrichedJob } from './JobList';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { JobRow } from './job-row';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'name' | 'status' | 'created_at' | 'opened_at';

interface JobTableProps {
  jobs: EnrichedJob[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  loading?: boolean;
}
import { JobsTableSkeleton } from './JobsSkeleton';
export function JobTable({
  jobs,
  sortField,
  sortDirection,
  onSort,
  loading
}: JobTableProps) {
  //   console.log('Jobs received in JobTable:', jobs) // Debugging Statement

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('name')}>
              Job Name
              {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('status')}>
              Status
              {sortField === 'status' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('created_at')}>
              Created At
              {sortField === 'created_at' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead>AI Bot Configured</TableHead>
         
          <TableHead>Departments</TableHead>
          <TableHead>Offices</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <JobsTableSkeleton />
        ) : jobs.length > 0 ? (
          jobs.map((job) => <JobRow key={job.id} job={job} />)
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No jobs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

