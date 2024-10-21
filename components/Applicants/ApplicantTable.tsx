'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Application } from "@/types/greenhouse"

interface ApplicantTableProps {
  applicants: Application[];
  disablePortal?: boolean;
}

export default function ApplicantTable({ applicants, disablePortal = false }: ApplicantTableProps) {
  const router = useRouter();

  const handleSelectApplicant = (applicant: Application) => {
    if (disablePortal) {
      router.push(`/applicants/${applicant.id}`);
    } else {
      // Implement your portal logic here if needed
    }
  };

  return (
    <div>
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
          {applicants.map((application) => (
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
    </div>
  );
}