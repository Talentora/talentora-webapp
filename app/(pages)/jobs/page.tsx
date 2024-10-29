'use client';

import JobList from '@/components/Jobs/JobList';
import { Job } from '@/types/greenhouse';

import { useEffect, useState } from 'react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await fetch('/api/jobs').then((res) => res.json());
      console.log('API fetching jobs', jobs);
      setJobs(jobs);
    };

    fetchJobs();
  }, []);

  return <JobList jobs={jobs} />;
}
