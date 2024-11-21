import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EnrichedJob } from './JobList';
import { Badge } from '@/components/ui/badge';

export function JobRow({ job }: { job: EnrichedJob }) {
  return (
    <TableRow>
      <TableCell>{job.name}</TableCell>
      <TableCell>
        <Badge variant={job.status.toLowerCase() === 'open' ? 'success' : 'secondary'}>
          {job.status
            ? job.status.charAt(0).toUpperCase() +
              job.status.slice(1).toLowerCase()
            : ''}
        </Badge>
      </TableCell>
      <TableCell>
        {new Date(job.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell>
        <Badge variant={job.isConfigured ? 'success' : 'failure'}>
          {job.isConfigured ? 'Yes' : 'No'}
        </Badge>
      </TableCell>
      <TableCell>
        {job.departments?.length
          ? job.departments
              .filter(Boolean)
              .map(dept => dept.name)
              .join(', ')
          : 'No department'}
      </TableCell>
      <TableCell>
        {job.offices?.length
          ? job.offices
              .filter(Boolean)
              .map(office => office.name)
              .join(', ')
          : 'No office'}
      </TableCell>


     
     
      <TableCell>
        <Link href={`/jobs/${job.id}`} passHref>
          <Button variant="outline">View details</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
