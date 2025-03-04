import { EnrichedJob } from './types';
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
import { JobsTableSkeleton } from './JobsSkeleton';

type SortField = 'name' | 'status' | 'created_at' | 'opened_at' | 'configured' | 'departments' | 'offices';

interface JobTableProps {
  jobs: EnrichedJob[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  loading?: boolean;
  visibleColumns: string[];
}

export function JobTable({
  jobs,
  sortField,
  sortDirection,
  onSort,
  loading,
  visibleColumns
}: JobTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.includes('id') && (
              <TableHead className="w-[120px] whitespace-nowrap">
                <Button variant="ghost" className="w-full justify-start">
                  Job Id
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('name') && (
              <TableHead className="w-[150px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('name')} className="w-full justify-start">
                  Job Name
                  {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('status') && (
              <TableHead className="w-[120px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('status')} className="w-full justify-start">
                  Status
                  {sortField === 'status' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('created_at') && (
              <TableHead className="w-[140px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('created_at')} className="w-full justify-start">
                  Created At
                  {sortField === 'created_at' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('configured') && (
              <TableHead className="w-[140px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('configured')} className="w-full justify-start">
                  Ora Scout Configured
                  {sortField === 'configured' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('departments') && (
              <TableHead className="w-[150px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('departments')} className="w-full justify-start">
                  Departments
                  {sortField === 'departments' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
            {visibleColumns.includes('offices') && (
              <TableHead className="w-[150px] whitespace-nowrap">
                <Button variant="ghost" onClick={() => onSort('offices')} className="w-full justify-start">
                  Offices
                  {sortField === 'offices' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <JobsTableSkeleton visibleColumns={visibleColumns} rowCount={3} />
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobRow key={job.id} job={job} visibleColumns={visibleColumns} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="text-center">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
