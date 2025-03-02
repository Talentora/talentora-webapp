'use client';

import { useState, useEffect } from 'react';
import InviteApplicantsTable from '@/components/Applicants/InviteApplicantsTable';
import { Loader2 } from 'lucide-react';
import { fetchJobsData } from '@/server/jobs';
import { fetchAllApplications } from '@/server/applications';

export default function ApplicantList() {
  const [applicantCandidates, setApplicantCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both joined applicants and jobs data
        const [applicantsData, jobsData] = await Promise.all([
          await fetchAllApplications(),
          await fetchJobsData()
        ]);
        
        if (!Array.isArray(applicantsData)) {
          console.error('Applicants data is not an array:', applicantsData);
          return;
        }
        
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

  // Helper function to get status priority for sorting
  const getStatusPriority = (applicant: any): number => {
    if (!applicant.AI_summary && !applicant.applicant) return 0; // Not invited
    if (!applicant.AI_summary && applicant.applicant) return 1;  // In progress
    return 2; // Review ready
  };

  const filteredApplicants = applicantCandidates
    .filter((app: any) => {
      // If there's no search term, show all applicants
      if (!searchTerm) return true;
      
      // If there's a search term but no candidate data, can't search by name
      if (!app.candidate) return false;
      
      const fullName = `${app.candidate.first_name} ${app.candidate.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a: any, b: any) => {
      if (sortField === 'status') {
        const statusA = getStatusPriority(a);
        const statusB = getStatusPriority(b);
        return sortDirection === 'asc' 
          ? statusA - statusB
          : statusB - statusA;
      }
      return 0;
    });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-14 flex items-center px-6 border-b shrink-0">
        <h1 className="text-lg font-semibold">Applicant Dashboard</h1>
      </header>
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="w-full max-w-[1200px] h-full">
              <InviteApplicantsTable 
                applicants={filteredApplicants} 
                jobs={jobs}
                onSort={(field) => {
                  if (sortField === field) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField(field);
                    setSortDirection('asc');
                  }
                }}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
