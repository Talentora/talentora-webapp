'use client';

import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import SearchBar from '@/components/Applicants/Searchbar';
import { Loader2 } from 'lucide-react';

export default function ApplicantList() {
  const [ApplicantCandidates, setApplicantCandidates] = useState<ApplicantCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantCandidates = async () => {
      try {
        const response = await fetch(`/api/applications`, {
          cache: 'no-store'
        });
        const data = await response.json();
        // Ensure data is an array before setting state
        setApplicantCandidates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching ApplicantCandidates:', error);
        setApplicantCandidates([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicantCandidates();
  }, []);

  const filteredApplicants = Array.isArray(ApplicantCandidates) 
    ? ApplicantCandidates.filter((applicant: ApplicantCandidate) => {
        if (!applicant?.candidate?.first_name || !applicant?.candidate?.last_name) {
          return false;
        }
        const fullName = `${applicant.candidate.first_name} ${applicant.candidate.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <h1 className="text-lg font-semibold">Applicant Dashboard</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            applicants={ApplicantCandidates}
          />
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ApplicantTable
                applicants={filteredApplicants}
                disablePortal={false} title={''}            />
          )}
        </div>
      </main>
    </div>
  );
}
