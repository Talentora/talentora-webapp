"use client"
import {useEffect,useState} from "react"
import InvitePage from '@/components/Invite';
import { Job } from "@/types/greenhouse";

const Page = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const fetchedJobs = await response.json();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="w-5/6">
      <InvitePage jobs={jobs} />
    </div>
  );
};

export default Page;
