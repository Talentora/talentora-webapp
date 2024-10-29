import { Job } from '@/types/greenhouse';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function JobRow({ job }: { job: Job }) {
  return (
    <TableRow>
      <TableCell>{job.name}</TableCell>
      <TableCell>{job.status}</TableCell>
      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(job.opened_at).toLocaleDateString()}</TableCell>
      <TableCell>{job.departments?.filter(Boolean).join(', ')}</TableCell>
      <TableCell>
        <Link href={`/jobs/${job.id}`} passHref>
          <Button variant="outline">View Details</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
