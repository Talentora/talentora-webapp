'use client';
import { useState, useEffect, useMemo } from 'react';
import { Job } from '@/types/merge';
import { SearchFilter } from './search-filer';
import { JobTable } from './job-table';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
type SortField = 'name' | 'status' | 'created_at' | 'opened_at';

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      console.log('Fetching jobs');
      const jobs = await fetch('/api/jobs').then((res) => res.json());
      console.log(`API fetched ${jobs.length} jobs`);
      setJobs(jobs);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

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
    // Filter jobs based on searchTerm
    return jobs.filter(job => job.name.toLowerCase().includes(searchTerm.toLowerCase())); 
  }, [jobs, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <>
          <h1 className="text-3xl font-bold m-2 text-primary-dark">Jobs</h1>
          <div className="flex justify-between flex-col bg-foreground border border-muted p-4 shadow-lg">
            <SearchFilter onSearch={handleSearch} searchTerm={searchTerm} />
            <JobTable
              jobs={paginatedJobs}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
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
      )}
    </div>
  );
}
