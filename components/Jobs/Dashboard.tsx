import { useState, useMemo, useEffect } from 'react';
import JobList from './JobList';
import JobPostingsHeader from '@/components/Jobs/JobPostingsHeader';
import { Job } from '@/types/greenhouse';

interface DashboardProps {
  dashboardData: {
    initialJobs: Job[];
  };
}

export default function Dashboard({ dashboardData }: DashboardProps) {
  const { initialJobs } = dashboardData;
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCardView, setIsCardView] = useState(true);
  const [filters, setFilters] = useState<{
    departments: string[];
    offices: string[];
  }>({
    departments: [],
    offices: []
  });
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);

  useEffect(() => {
    console.log('jobs', jobs);
  }, [jobs]);

  const filterOptions = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        departments: [],
        offices: []
      };
    }
    return {
      departments: [
        ...new Set(
          jobs
            .flatMap((job) => job.departments)
            .filter((dept): dept is string => !!dept)
        )
      ],
      offices: [
        ...new Set(
          jobs.flatMap((job) => job.offices).filter((office): office is string => !!office)
        )
      ]
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesSearch =
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((job.notes?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);
      const matchesDepartment =
        filters.departments.length === 0 ||
        ((job.departments?.some((dept) => dept && filters.departments.includes(dept))) ?? false);
      const matchesOffice =
        filters.offices.length === 0 ||
        ((job.offices?.some((office) => office && filters.offices.includes(office))) ?? false);
      return matchesSearch && matchesDepartment && matchesOffice;
    });
  }, [jobs, searchTerm, filters]);

  

  const jobPostingsHeaderData = {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filterOptions,
    onCreateJob: () => setIsCreateJobDialogOpen(true)
  };

  const jobListData = {
    filteredJobs,
    isCardView,
    toggleView: () => setIsCardView(!isCardView)
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <JobPostingsHeader headerData={jobPostingsHeaderData} />
        {filteredJobs.length > 0 ? (
          <JobList jobListData={jobListData} />
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-primary-400">No jobs found</p>
          </div>
        )}
      </main>
      
    </div>
  );
}