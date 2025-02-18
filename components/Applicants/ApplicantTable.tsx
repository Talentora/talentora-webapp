"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ApplicantCandidate } from "@/types/merge"
import ApplicantPortal from "@/components/Applicants/Applicant/ApplicantPortal"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ApplicantTableProps {
  applicants: ApplicantCandidate[]
  disablePortal?: boolean
  title: string // New prop for the table title
}

export default function ApplicantTable({ applicants, disablePortal = false, title }: ApplicantTableProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantCandidate | null>(null)
  const router = useRouter()

  // Early return if applicants is null or undefined
  if (!applicants) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p>No applicants available</p>
      </div>
    );
  }

  const handleSelectApplicant = (applicant: ApplicantCandidate) => {
    router.push(`/applicants/${applicant.application.id}`)
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
          {Array.isArray(applicants) && applicants.map((applicant: ApplicantCandidate) => {
            if (!applicant?.application?.id) return null;
            
            return (
              <TableRow
                key={applicant.application.id}
                onClick={() => handleSelectApplicant(applicant)}
                className="cursor-pointer"
              >
                <TableCell>{`${applicant.candidate?.first_name || ''} ${applicant.candidate?.last_name || ''}`}</TableCell>
                <TableCell>{applicant.job?.name || "No job specified"}</TableCell>
                <TableCell>{applicant.candidate?.email_addresses?.[0]?.value || "No email address"}</TableCell>
                <TableCell className="text-red-500">8</TableCell>
                <TableCell className="text-red-500">10</TableCell>
                <TableCell>{applicant.interviewStages?.name || "No interview stage specified"}</TableCell>
                <TableCell
                  className="underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectApplicant(applicant)
                  }}
                >
                  View Report
                </TableCell>
              </TableRow>
            );
          })}
          {(!Array.isArray(applicants) || applicants.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No applicants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

