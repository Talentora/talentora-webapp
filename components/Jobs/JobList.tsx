'use client';

import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tables } from '@/types/types_db';
import {CardView} from './CardView';
import { TableView } from './TableView';

type Job = Tables<'jobs'>;

interface JobListProps {
  filteredJobs: Job[];
  isCardView: boolean;
  toggleView: () => void;
}

export default function JobList({
  filteredJobs,
  isCardView,
  toggleView
}: JobListProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <LayoutGridIcon className="h-4 w-4" />
        <Switch
          checked={!isCardView}
          onCheckedChange={toggleView}
          id="view-toggle"
        />
        <ListIcon className="h-4 w-4" />
        <label htmlFor="view-toggle" className="text-sm text-muted-foreground">
          {isCardView ? 'Card View' : 'Table View'}
        </label>
      </div>
      {isCardView ? (
        <CardView filteredJobs={filteredJobs} />
      ) : (
        <TableView filteredJobs={filteredJobs} />
      )}
    </>
  );
}
