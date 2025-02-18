'use client';

import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import SearchBar from '@/components/Applicants/Searchbar';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function ApplicantList() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { 
    data: ApplicantCandidates = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['applicants'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch('/api/applications', {
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching ApplicantCandidates:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2
  });

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
            <div className="flex flex-col gap-4 items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading applicants...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-sm text-destructive">Error loading applicants. Please try again.</p>
            </div>
          ) : (
            <ApplicantTable
              applicants={filteredApplicants}
              disablePortal={false}
              title={''}
            />
          )}
        </div>
      </main>
    </div>
  );
}
