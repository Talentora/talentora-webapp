'use client';

import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import SearchBar from '@/components/Applicants/Searchbar';
import { Loader2 } from 'lucide-react';

export default function ApplicantList() {
  const [ApplicantCandidates, setApplicantCandidates] = useState<
    ApplicantCandidate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantCandidates = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications`,
          { cache: 'no-store' }
        );
        const data: ApplicantCandidate[] = await response.json();
        setApplicantCandidates(data);
      } catch (error) {
        console.error('Error fetching ApplicantCandidates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicantCandidates();
  }, []);

  const filteredApplicants = ApplicantCandidates.filter(
    (ApplicantCandidate: ApplicantCandidate) => {
      const fullName =
        `${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <h1 className="text-lg font-semibold">Applicant Dashboard</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ApplicantTable
              applicants={filteredApplicants}
              disablePortal={false}
            />
          )}
        </div>
      </main>
    </div>
  );
}
