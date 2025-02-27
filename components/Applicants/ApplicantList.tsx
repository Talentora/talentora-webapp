'use client';

import { useState, useEffect } from 'react';
import InviteApplicantsTable from '@/components/Applicants/InviteApplicantsTable';
import { Loader2 } from 'lucide-react';
import { fetchAllEnrichedApplicants } from '@/server/applications';
import { fetchJobsData } from '@/server/jobs';

export default function ApplicantList() {
  const [applicantCandidates, setApplicantCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both joined applicants and jobs data
        const [applicantsData, jobsData] = await Promise.all([
          fetchAllEnrichedApplicants(),
          fetchJobsData()
        ]);
        
        // Log data to inspect AI summary structure
        console.log("Applicants data:", applicantsData);
        console.log("Jobs data:", jobsData);
        
        // Check for AI summary data
        applicantsData.forEach((app: any, index: number) => {
          console.log(`Applicant ${index}:`, {
            hasAISummary: !!app.AI_summary,
            AI_summary: app.AI_summary,
            isEmptyArray: Array.isArray(app.AI_summary) && app.AI_summary.length === 0
          });
        });
        
        setApplicantCandidates(applicantsData);
        setJobs(jobsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredApplicants = applicantCandidates.filter(
    (app: any) => {
      // If there's no search term, show all applicants
      if (!searchTerm) return true;
      
      // If there's a search term but no candidate data, can't search by name
      if (!app.candidate) return false;
      
      const fullName = `${app.candidate.first_name} ${app.candidate.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 flex items-center">
        <h1 className="text-lg font-semibold">Applicant Dashboard</h1>
      </header>
      <main className="flex-1 pr-10">
        <div className="space-y-4">
          {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} applicants={applicantCandidates} /> */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <InviteApplicantsTable applicants={filteredApplicants} jobs={jobs} />
          )}
        </div>
      </main>
    </div>
  );
}
