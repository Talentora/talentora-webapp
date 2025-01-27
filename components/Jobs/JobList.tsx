'use client';
import { useState, useEffect, useMemo } from 'react';
import { Job, Job as MergeJob } from '@/types/merge';
import { SearchFilter } from './search-filer';
import { JobTable } from './job-table';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getJobInterviewConfig } from '@/utils/supabase/queries';
type SortField = 'name' | 'status' | 'created_at' | 'opened_at' | 'configured' | 'departments' | 'offices';
import { JobFilters, JobFilters as JobFiltersType } from './JobFilters';
import { Tables } from '@/types/types_db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export type EnrichedJob = Tables<'jobs'> & 
  MergeJob & {
    isConfigured?: boolean;
    interviewConfig?: Tables<'job_interview_config'>;
  };

export default function JobListPage() {
  const [jobs, setJobs] = useState<EnrichedJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [filters, setFilters] = useState<JobFiltersType>({
    status: {
      open: false,
      closed: false,
      draft: false,
    },
    configured: {
      yes: false,
      no: false,
    },
    department: {},
  });
  const itemsPerPage = 10;

  // Fetch jobs from API and Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      console.log('Fetching jobs');
      
      try {
        // Fetch jobs from API
        const apiJobs = await fetch('/api/jobs').then((res) => res.json());
      
        // Enrich with interview config data from Supabase
        const enrichedJobs = await Promise.all(
          apiJobs.map(async (job: Job) => {
            const interviewConfig = await getJobInterviewConfig(job.id);
            return {
              ...job,
              isConfigured: !!interviewConfig,
              interviewConfig: interviewConfig || undefined
            };
          })
        );

        console.log(`Fetched ${enrichedJobs.length} enriched jobs`);
        setJobs(enrichedJobs);
        
        // Check if any jobs are configured
        const hasConfiguredJobs = enrichedJobs.some(job => job.isConfigured);
        if (!hasConfiguredJobs) {
          setShowConfigDialog(true);
        }

      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Memoize the jobs to prevent unnecessary re-renders
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Search filter
      const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if any filters are active
      const hasStatusFilters = Object.values(filters.status).some(value => value);
      const hasConfiguredFilters = Object.values(filters.configured).some(value => value);
      const hasDepartmentFilters = Object.values(filters.department).some(value => value);
      
      // If no filters are active, only apply search
      if (!hasStatusFilters && !hasConfiguredFilters && !hasDepartmentFilters) {
        return matchesSearch;
      }

      // Status filter
      const matchesStatus = !hasStatusFilters || filters.status[job.status.toLowerCase() as keyof typeof filters.status];

      // Configuration filter
      const matchesConfig = !hasConfiguredFilters || 
        (filters.configured.yes && job.isConfigured) ||
        (filters.configured.no && !job.isConfigured);

      // Department filter
      const matchesDepartment = !hasDepartmentFilters ||
        job.departments?.some(dept => 
          dept && filters.department[dept.name.toLowerCase()]
        );

      return matchesSearch && matchesStatus && matchesConfig && matchesDepartment;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
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
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [jobs, searchTerm, filters, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach(job => {
      job.departments?.forEach(dept => {
        if (dept?.name) {
          depts.add(dept.name);
        }
      });
    });
    return Array.from(depts);
  }, [jobs]);

  return (
    <div className="container mx-auto py-8">
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Configured Jobs Found</DialogTitle>
            <DialogDescription>
              You have no jobs configured for Talentora's AI assessment. Would you like to configure them now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => window.location.href = '/jobs/configure'}>
              Configure Jobs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : ( */}
        <>
          <h1 className="text-3xl font-bold m-2 text-primary-dark">Jobs</h1>
          <div className="flex justify-between flex-col border border-muted p-4 m-5 shadow-lg">
            <div className='flex flex-row gap-2 justify-between'>
              <JobFilters onFilterChange={handleFilterChange} initialFilters={filters} departments={uniqueDepartments} />
              <SearchFilter jobs={jobs} onSearch={handleSearch} searchTerm={searchTerm} />
            </div>
            <JobTable
              jobs={paginatedJobs}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              loading={isLoading}
            />
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      {/* ) */}
    </div>
  );
}
