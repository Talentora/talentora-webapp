"use client"
import { useState, useEffect } from 'react';
import { JobList } from "@/components/Jobs/JobList"; 
import { Job } from "@/types/greenhouse";

const ApplicantDashboard: React.FC = () => {
    const [jobListData, setJobListData] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`);
            if (jobsResponse.ok) {
                const jobsData = await jobsResponse.json();
                setJobListData(jobsData);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div>
            <h1>Applicant Dashboard</h1>
            <JobList 
                jobs={jobListData}
                onDeleteJob={() => {}}
            />
        </div>
    )
}

export default ApplicantDashboard;