import { Job } from '@/types/merge';
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
  jobs: Job[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function JobTable({
  jobs,
  sortField,
  sortDirection,
  onSort
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
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('opened_at')}>
              Opened At
              {sortField === 'opened_at' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead>Departments</TableHead>
          <TableHead>Offices</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length > 0 ? (
          jobs.map((job) => <JobRow key={job.id} job={job} />)
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No jobs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
