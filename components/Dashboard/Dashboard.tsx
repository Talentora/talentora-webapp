'use client';

import { useState, useMemo, useEffect } from 'react';
import JobList from './JobList';
import JobPostingsHeader from '@/components/Dashboard/JobPostingsHeader';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface DashboardProps {
  jobs: Job[];
}

export default function Dashboard({ jobs }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCardView, setIsCardView] = useState(true);
  const [filters, setFilters] = useState({
    departments: [],
    locations: []
  });

  useEffect(() => {
    console.log('jobs', jobs);
  }, [jobs]);

  const filterOptions = useMemo(() => {
    return {
      departments: [...new Set(jobs.map((job) => job.department))],
      locations: [...new Set(jobs.map((job) => job.location))]
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        filters.departments.length === 0 ||
        // @ts-ignore
        filters.departments.includes(job.department);

      const matchesLocation =
        filters.locations.length === 0 ||
        // @ts-ignore
        filters.locations.includes(job.location);

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchTerm, filters]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <JobPostingsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
        />
        {filteredJobs.length > 0 ? (
          <JobList
            filteredJobs={filteredJobs}
            isCardView={isCardView}
            toggleView={() => setIsCardView(!isCardView)}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-primary-400">No jobs found</p>
          </div>
        )}
      </main>
    </div>
  );
}
