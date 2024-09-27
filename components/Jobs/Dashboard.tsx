'use client';

import { useState, useMemo, useEffect } from 'react';
import JobList from './JobList';
import JobPostingsHeader from '@/components/Jobs/JobPostingsHeader';
import { Tables } from '@/types/types_db';
import { createJob, getJobs } from '@/utils/supabase/queries';
import { CreateJobForm } from './CreateJobForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';

type Job = Tables<'jobs'>;

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
  const [filters, setFilters] = useState<{ departments: string[]; locations: string[] }>({
    departments: [],
    locations: []
  });
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);

  useEffect(() => {
    console.log('jobs', jobs);
  }, [jobs]);

  const filterOptions = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        departments: [],
        locations: []
      };
    }
    return {
      departments: [
        ...new Set(jobs.map((job) => job.department).filter((dept): dept is string => !!dept))
      ],
      locations: [...new Set(jobs.map((job) => job.location).filter((loc): loc is string => !!loc))]
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        filters.departments.length === 0 ||
        (job.department && filters.departments.includes(job.department));
      const matchesLocation =
        filters.locations.length === 0 ||
        (job.location && filters.locations.includes(job.location));
      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchTerm, filters]);

  const handleCreateJob = async (jobData: Omit<Job, 'id'>) => {
    try {
      await createJob(jobData);
      setIsCreateJobDialogOpen(false);
      const supabase = createClient();
      const updatedJobs = await getJobs(supabase);
      setJobs(updatedJobs);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

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
    toggleView: () => setIsCardView(!isCardView),
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
      <Dialog
        open={isCreateJobDialogOpen}
        onOpenChange={setIsCreateJobDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <CreateJobForm
            formData={{
              onSubmit: handleCreateJob,
              onCancel: () => setIsCreateJobDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
