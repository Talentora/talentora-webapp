'use client';
import { useMemo } from 'react';
import { useJobList } from './hooks/useJobList';
import { JobListHeader } from './components/JobListHeader';
import { JobListContent } from './components/JobListContent';
import { Column } from './types';

const COLUMNS: Column[] = [
  { key: 'id', label: 'Job Id' },
  { key: 'name', label: 'Job Name' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created At' },
  { key: 'configured', label: 'AI Bot Configured' },
  { key: 'departments', label: 'Departments' },
  { key: 'offices', label: 'Offices' },
];

export default function JobListPage() {
  const {
    state,
    actions,
    loading,
    error,
    filteredJobs,
    paginatedJobs,
    totalPages,
  } = useJobList();

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    filteredJobs.forEach(job => {
      job.departments?.forEach(dept => {
        if (dept?.name) {
          depts.add(dept.name);
        }
      });
    });
    return Array.from(depts);
  }, [filteredJobs]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error loading jobs</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const showConfigDialog = !loading && filteredJobs.length > 0 && 
    !filteredJobs.some(job => job.isConfigured);

  return (
    <div className="container mx-auto mr-4 max-w-full overflow-hidden">
      <div className='gap-2 flex flex-col'>
        <JobListHeader
          state={state}
          actions={actions}
          enrichedJobs={filteredJobs}
          departments={uniqueDepartments}
          columns={COLUMNS}
        />
        <JobListContent
          state={state}
          actions={actions}
          loading={loading}
          paginatedJobs={paginatedJobs}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
