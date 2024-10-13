"use client"

import { useState } from "react"
import { Application } from "@/types/greenhouse"
import ApplicantTable from "@/components/Applicants/ApplicantTable"
import ApplicantPortal from "@/components/Applicants/Applicant/ApplicantPortal"
import SearchBar from "@/components/Applicants/Searchbar"

interface ApplicantListProps {
  applications: Application[];
}

export default function ApplicantList({ applications }: ApplicantListProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

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
        {selectedApplicant ? (
          <ApplicantPortal application={selectedApplicant} onBack={() => setSelectedApplicant(null)} />
        ) : (
          <div className="space-y-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ApplicantTable 
              applicants={filteredApplicants} 
              onSelectApplicant={setSelectedApplicant} 
            />
          </div>
        )}
      </main>
    </div>
  )
}