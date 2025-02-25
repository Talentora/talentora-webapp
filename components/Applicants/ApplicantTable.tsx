"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ApplicantCandidate } from "@/types/merge"
import ApplicantPortal from "@/components/Applicants/Applicant/ApplicantPortal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'; // Added for loading indicator

interface ApplicantTableProps {
  applicants: ApplicantCandidate[]
  disablePortal?: boolean
  title: string // New prop for the table title
}

export default function ApplicantTable({ applicants, disablePortal = false, title }: ApplicantTableProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantCandidate | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false) // Added for loading state
  const router = useRouter()

  const handleSelectApplicant = async (applicant: ApplicantCandidate) => {
    setIsLoading(true) // Start loading indicator
    await router.push(`/applicants/${applicant.application.id}`)
    setIsLoading(false) // Stop loading indicator
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Table className="border border-transparent rounded-lg">
        <TableHeader className="bg-primary-dark rounded-lg">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Overall Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((ApplicantCandidate: ApplicantCandidate) => (
            <TableRow
              key={ApplicantCandidate.application.id}
              onClick={() => handleSelectApplicant(ApplicantCandidate)}
              className="cursor-pointer"
            >
              <TableCell>{`${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`}</TableCell>
              <TableCell>{ApplicantCandidate.job.name || "No job specified"}</TableCell>
              <TableCell>{ApplicantCandidate.candidate.email_addresses?.[0]?.value || "No email address"}</TableCell>
              <TableCell className="text-red-500">8</TableCell>
              <TableCell className="text-red-500">10</TableCell>
              <TableCell>{ApplicantCandidate.interviewStages.name || "No interview stage specified"}</TableCell>
              <TableCell
                className="underline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectApplicant(ApplicantCandidate)
                }}
              >
                View Report
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  )
}

