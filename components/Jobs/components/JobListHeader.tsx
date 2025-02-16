import { SearchFilter } from '../search-filer';
import { JobFilters } from '../JobFilters';
import { Column, JobFiltersType, JobListActions, JobListState } from '../types';
import type { EnrichedJob } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type JobListHeaderProps = {
  state: JobListState;
  actions: JobListActions;
  enrichedJobs: EnrichedJob[];
  departments: string[];
  columns: Column[];
};

export function JobListHeader({
  state,
  actions,
  enrichedJobs,
  departments,
  columns,
}: JobListHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <h1 className="text-3xl font-bold text-primary-dark shrink-0">Jobs</h1>

        <div className="flex items-center gap-6 w-full">
          <div className="w-1/3">
            <JobFilters
              onFilterChange={actions.setFilters}
              initialFilters={state.filters}
              departments={departments}
            />
          </div>
          <div className="w-1/3">
            <SearchFilter
              jobs={enrichedJobs}
              onSearch={actions.setSearchTerm}
              searchTerm={state.searchTerm}
            />
          </div>
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    className="capitalize"
                    checked={state.visibleColumns.includes(column.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        actions.setVisibleColumns([...state.visibleColumns, column.key]);
                      } else {
                        actions.setVisibleColumns(
                          state.visibleColumns.filter((key) => key !== column.key)
                        );
                      }
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}