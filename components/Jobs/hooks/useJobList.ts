import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobInterviewConfig } from '@/utils/supabase/queries';
import type { Job } from '@/types/merge';
import {
  JobListState,
  JobListActions,
  JobFiltersType,
  SortField,
  EnrichedJob,
} from '../types';

const ITEMS_PER_PAGE = 10;

export function useJobList(): {
  state: JobListState;
  actions: JobListActions;
  loading: boolean;
  error: unknown;
  filteredJobs: EnrichedJob[];
  paginatedJobs: EnrichedJob[];
  totalPages: number;
} {
  const [state, setState] = useState<JobListState>({
    searchTerm: '',
    sortField: 'created_at',
    sortDirection: 'desc',
    currentPage: 1,
    filters: {
      status: { open: false, closed: false, draft: false },
      configured: { yes: false, no: false },
      department: {},
    },
    visibleColumns: ['id', 'name', 'status', 'created_at', 'configured', 'departments', 'offices'],
  });

  // Fetch jobs
  const { data: apiJobs = [], isLoading: apiLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Fetch and enrich jobs with interview configs
  const { data: enrichedJobs = [], isLoading: enrichedLoading } = useQuery({
    queryKey: ['jobConfigs', apiJobs],
    queryFn: async () => {
      const enriched = await Promise.all(
        apiJobs.map(async (job: Job) => {
          const interviewConfig = await getJobInterviewConfig(job.id);
          return {
            ...job,
            isConfigured: !!interviewConfig,
            interviewConfig: interviewConfig || undefined
          };
        })
      );
      return enriched;
    },
    enabled: apiJobs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const actions: JobListActions = {
    setSearchTerm: (term) => {
      setState(prev => ({ ...prev, searchTerm: term, currentPage: 1 }));
    },
    setSortField: (field) => {
      setState(prev => ({
        ...prev,
        sortField: field,
        sortDirection: prev.sortField === field ? 
          (prev.sortDirection === 'asc' ? 'desc' : 'asc') : 
          'asc'
      }));
    },
    setSortDirection: (direction) => {
      setState(prev => ({ ...prev, sortDirection: direction }));
    },
    setCurrentPage: (page) => {
      setState(prev => ({ ...prev, currentPage: page }));
    },
    setFilters: (filters) => {
      setState(prev => ({ ...prev, filters, currentPage: 1 }));
    },
    setVisibleColumns: (columns) => {
      setState(prev => ({ ...prev, visibleColumns: columns }));
    },
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = enrichedJobs.filter(job => {
      const matchesSearch = job.name.toLowerCase().includes(state.searchTerm.toLowerCase());
      
      const hasStatusFilters = Object.values(state.filters.status).some(value => value);
      const hasConfiguredFilters = Object.values(state.filters.configured).some(value => value);
      const hasDepartmentFilters = Object.values(state.filters.department).some(value => value);
      
      if (!hasStatusFilters && !hasConfiguredFilters && !hasDepartmentFilters) {
        return matchesSearch;
      }

      const matchesStatus = !hasStatusFilters || 
        state.filters.status[job.status.toLowerCase() as keyof typeof state.filters.status];
      const matchesConfig = !hasConfiguredFilters || 
        (state.filters.configured.yes && job.isConfigured) ||
        (state.filters.configured.no && !job.isConfigured);
      const matchesDepartment = !hasDepartmentFilters ||
        job.departments?.some((dept: { name: string }) => 
          dept && state.filters.department[dept.name.toLowerCase()]
        );

      return matchesSearch && matchesStatus && matchesConfig && matchesDepartment;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'configured':
          comparison = (a.isConfigured ? 1 : 0) - (b.isConfigured ? 1 : 0);
          break;
        case 'departments':
          comparison = (a.departments?.[0]?.name || '').localeCompare(b.departments?.[0]?.name || '');
          break;
        case 'offices':
          comparison = (a.offices?.[0]?.name || '').localeCompare(b.offices?.[0]?.name || '');
          break;
        default:
          comparison = 0;
      }
      return state.sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [enrichedJobs, state.searchTerm, state.filters, state.sortField, state.sortDirection]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  
  const paginatedJobs = useMemo(() => {
    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, state.currentPage]);

  return {
    state,
    actions,
    loading: apiLoading || enrichedLoading,
    error,
    filteredJobs,
    paginatedJobs,
    totalPages,
  };
} 