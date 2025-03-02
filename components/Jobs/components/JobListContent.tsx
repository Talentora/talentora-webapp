import { JobTable } from '../job-table';
import { JobListPagination } from './JobListPagination';
import { JobListState, JobListActions, EnrichedJob } from '../types';

type JobListContentProps = {
  state: JobListState;
  actions: JobListActions;
  loading: boolean;
  paginatedJobs: EnrichedJob[];
  totalPages: number;
};

export function JobListContent({
  state,
  actions,
  loading,
  paginatedJobs,
  totalPages,
}: JobListContentProps) {
  return (
    <div className="space-y-4">
      <div className="w-full border rounded-lg overflow-hidden">
        <JobTable
          jobs={paginatedJobs}
          sortField={state.sortField}
          sortDirection={state.sortDirection}
          onSort={actions.setSortField}
          loading={loading}
          visibleColumns={state.visibleColumns}
        />
      </div>
      {!loading && totalPages > 1 && (
        <JobListPagination
          currentPage={state.currentPage}
          totalPages={totalPages}
          onPageChange={actions.setCurrentPage}
        />
      )}
    </div>
  );
} 