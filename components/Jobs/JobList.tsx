"use client"
import { useState, useEffect } from 'react';
import { Job } from '@/types/merge';
import { SearchFilter } from './search-filer';
import { JobTable } from './job-table';
import { Loader2 } from 'lucide-react';
type SortField = 'name' | 'status' | 'created_at' | 'opened_at';

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);



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

  // useEffect(() => {
  //   let filteredJobs = jobs;

  //   // Only apply filtering if the search term is not empty
  //   if (searchTerm.trim()) {
  //     filteredJobs = jobs.filter(
  //       (job) =>
  //         job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         job.id?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   const sortedJobs = filteredJobs.sort((a, b) => {
  //     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
  //     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
  //     return 0;
  //   });

  //   setJobs(sortedJobs);
  // }, [searchTerm, sortField, sortDirection, jobs]);

  const handleSearch = (term: string) => setSearchTerm(term);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
          <SearchFilter onSearch={handleSearch} searchTerm={searchTerm} />
          <JobTable
            jobs={jobs}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </>
      )}
    </div>
  );
}
