'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function JobRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-[14%]">
        <Skeleton className="h-4 w-[90%]" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-5 w-[85%] rounded-full" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-4 w-[80%]" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-5 w-[75%] rounded-full" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-4 w-[85%]" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-4 w-[85%]" />
      </TableCell>
      <TableCell className="w-[14%]">
        <Skeleton className="h-9 w-[80%] rounded-md" />
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
