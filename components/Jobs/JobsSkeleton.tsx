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

interface JobsTableSkeletonProps {
  visibleColumns: string[];
  rowCount?: number;
}

export function JobsTableSkeleton({ visibleColumns, rowCount = 3 }: JobsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          {visibleColumns.includes('id') && (
            <TableCell className="whitespace-nowrap">
              <Skeleton className="h-4 w-16" />
            </TableCell>
          )}
          {visibleColumns.includes('name') && (
            <TableCell className="max-w-[200px]">
              <Skeleton className="h-4 w-40" />
            </TableCell>
          )}
          {visibleColumns.includes('status') && (
            <TableCell className="whitespace-nowrap">
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
          )}
          {visibleColumns.includes('created_at') && (
            <TableCell className="whitespace-nowrap">
              <Skeleton className="h-4 w-24" />
            </TableCell>
          )}
          {visibleColumns.includes('configured') && (
            <TableCell className="whitespace-nowrap">
              <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
          )}
          {visibleColumns.includes('departments') && (
            <TableCell className="max-w-[200px]">
              <div className="flex gap-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </TableCell>
          )}
          {visibleColumns.includes('offices') && (
            <TableCell className="max-w-[200px]">
              <div className="flex gap-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
