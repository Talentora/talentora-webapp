"use client"
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Jobs';
import { Job } from '@/types/greenhouse';
const Page = () => {
  // State to store jobs and loading/error states
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

 
  // Fetch jobs using useEffect
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Error fetching jobs');
        }
        const jobsData = await response.json();
        setJobs(jobsData);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }


    fetchJobs();
  }, []); // Empty dependency array means this runs once after component mounts

  // Render loading, error, or the Dashboard component
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4 text-xl font-semibold text-primary">Loading jobs...</p>
        </div>
      ) : error ? (
        <p>Error fetching jobs</p>
      ) : (
        jobs && <Dashboard jobs={jobs} />
      )}
    </div>
  );
};

export default Page;
