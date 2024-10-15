'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Application } from "@/types/greenhouse"
import ApplicantPortal from "@/components/Applicants/Applicant/ApplicantPortal"

interface ApplicantTableProps {
  applicants: Application[];
  rowLimit?: number;
}

export default function ApplicantTable({ applicants, rowLimit = Infinity }: ApplicantTableProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  const handleSelectApplicant = (applicant: Application) => {
    setSelectedApplicant(applicant);
  };

  const handleBackToList = () => {
    setSelectedApplicant(null);
  };

  return (
    <div>
      {selectedApplicant ? (
        <ApplicantPortal 
          application={selectedApplicant} 
          onBack={handleBackToList} 
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Applied On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.slice(0, rowLimit).map((application) => (
              <TableRow 
                key={application.id} 
                onClick={() => handleSelectApplicant(application)} 
                className="cursor-pointer"
              >
                <TableCell>{`${application.candidate.first_name} ${application.candidate.last_name}`}</TableCell>
                <TableCell>{application.jobs[0]?.name || 'No job specified'}</TableCell>
                <TableCell>{application.candidate.email_addresses[0]?.value || 'No email address'}</TableCell>
                <TableCell>{application.candidate.phone_numbers[0]?.value || 'No phone number'}</TableCell>
                <TableCell>{new Date(application.applied_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}