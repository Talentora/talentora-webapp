import { Tables } from '@/types/types_db';
import { Job as MergeJob } from '@/types/merge';

export type SortField = 'name' | 'status' | 'created_at' | 'opened_at' | 'configured' | 'departments' | 'offices';
export type SortDirection = 'asc' | 'desc';

export type EnrichedJob = Tables<'jobs'> & MergeJob & {
  isConfigured?: boolean;
  interviewConfig?: Tables<'job_interview_config'>;
};

export type Column = {
  key: string;
  label: string;
};

export type JobFiltersType = {
  status: {
    open: boolean;
    closed: boolean;
    draft: boolean;
  };
  configured: {
    yes: boolean;
    no: boolean;
  };
  department: Record<string, boolean>;
};

export type JobTableProps = {
  jobs: EnrichedJob[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  loading?: boolean;
  visibleColumns: string[];
};

export type JobRowProps = {
  job: EnrichedJob;
  visibleColumns: string[];
};

export type JobListState = {
  searchTerm: string;
  sortField: SortField;
  sortDirection: SortDirection;
  currentPage: number;
  filters: JobFiltersType;
  visibleColumns: string[];
};

export type JobListActions = {
  setSearchTerm: (term: string) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: JobFiltersType) => void;
  setVisibleColumns: (columns: string[]) => void;
}; 