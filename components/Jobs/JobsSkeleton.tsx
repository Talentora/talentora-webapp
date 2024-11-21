'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function JobRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[80px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[60px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-[100px] rounded-md" />
      </TableCell>
    </TableRow>
  );
}

export function JobsTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <JobRowSkeleton key={i} />
      ))}
    </>
  );
}
