import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EnrichedJob } from './JobList';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function JobRow({ job }: { job: EnrichedJob }) {
  const router = useRouter();
  return (
    <TableRow onClick={() => router.push(`/jobs/${job.id}`)}>
      <TableCell className="text-center">{job.id.slice(0, 6)}...</TableCell>
      <TableCell className="text-center">{job.name}</TableCell>
      <TableCell className="text-center">
        <Badge variant={job.status.toLowerCase() === 'open' ? 'success' : 'secondary'}>
          {job.status
            ? job.status.charAt(0).toUpperCase() +
              job.status.slice(1).toLowerCase()
            : ''}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {new Date(job.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={job.isConfigured ? 'success' : 'failure'}>
          {job.isConfigured ? 'Yes' : 'No'}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {job.departments?.length ? (
          <div className="flex gap-1 flex-wrap justify-center">
            {job.departments
              .filter(Boolean)
              .map(dept => (
                <Badge key={dept.name} variant="secondary">
                  {dept.name}
                </Badge>
              ))}
          </div>
        ) : (
          'No department'
        )}
      </TableCell>
      <TableCell className="text-center">
        {job.offices?.length ? (
          <div className="flex gap-1 flex-wrap justify-center">
            {job.offices
              .filter(Boolean)
              .map(office => (
                <Badge key={office.name} variant="secondary">
                  {office.name}
                </Badge>
              ))}
          </div>
        ) : (
          'No office'
        )}
      </TableCell>
    </TableRow>
  );
}
