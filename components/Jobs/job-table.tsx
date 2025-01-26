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
import { useState } from 'react';
import { JobsTableSkeleton } from './JobsSkeleton';

type SortField = 'name' | 'status' | 'created_at' | 'opened_at' | 'configured' | 'departments' | 'offices';

interface JobTableProps {
  jobs: EnrichedJob[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  loading?: boolean;
}

const ROWS_PER_PAGE = 10;

export function JobTable({
  jobs,
  sortField,
  sortDirection,
  onSort,
  loading
}: JobTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + ROWS_PER_PAGE);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>
              <Button variant="ghost" onClick={() => onSort('name')}>
                Job Id
                {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('name')}>
                Job Name
                {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('status')}>
                Status
                {sortField === 'status' && <ArrowUpDown className="ml-2 h-4 w-4" />}
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
              <Button variant="ghost" onClick={() => onSort('departments')}>
                Departments
                {sortField === 'departments' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('offices')}>
                Offices
                {sortField === 'offices' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('configured')}>
                AI Bot Configured
                {sortField === 'configured' && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <JobsTableSkeleton />
          ) : paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => <JobRow key={job.id} job={job} />)
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
