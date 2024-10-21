"use client"

import { useState, useEffect } from "react"
import { Application } from "@/types/greenhouse"
import ApplicantTable from "@/components/Applicants/ApplicantTable"
import SearchBar from "@/components/Applicants/Searchbar"

export default function ApplicantList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/applications`, { cache: 'no-store' });
        const data: Application[] = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplicants = applications.filter((application) => {
    const fullName = `${application.candidate.first_name} ${application.candidate.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <h1 className="text-lg font-semibold">Applicant Management System</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {isLoading ? (
            <p>Loading applications...</p>
          ) : (
            <ApplicantTable 
              applicants={filteredApplicants} 
              disablePortal={false} 
            />
          )}
        </div>
      </main>
    </div>
  )
}