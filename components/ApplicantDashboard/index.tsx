"use client"
import { useState, useEffect } from 'react';
import { CardView } from "../Jobs/CardView"; 
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
            <CardView 
                cardViewData={{
                    filteredJobs: jobListData,
                    onDeleteJob: () => {}
                }}
            />
        </div>
    )
}

export default ApplicantDashboard;