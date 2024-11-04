import { Job } from '@/types/merge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function JobRow({ job }: { job: Job }) {
  return (
    <TableRow>
      <TableCell>{job.name}</TableCell>
      <TableCell>
        {job.status
          ? job.status.charAt(0).toUpperCase() +
            job.status.slice(1).toLowerCase()
          : ''}
      </TableCell>
      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(job.modified_at).toLocaleDateString()}</TableCell>
      <TableCell>
        {job.departments?.length
          ? job.departments
              .filter(Boolean)
              .map(
                (dept) =>
                  dept.name.charAt(0).toUpperCase() +
                  dept.name.slice(1).toLowerCase()
              )
              .join(', ')
          : 'No department'}
      </TableCell>
      <TableCell>
        {job.offices?.length
          ? job.offices
              .filter(Boolean)
              .map(
                (office) =>
                  office.name.charAt(0).toUpperCase() +
                  office.name.slice(1).toLowerCase()
              )
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
