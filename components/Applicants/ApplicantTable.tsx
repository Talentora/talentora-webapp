'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ApplicantCandidate } from "@/types/greenhouse"
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ApplicantTableProps {
  applicants: ApplicantCandidate[];
  disablePortal?: boolean;
}

export default function ApplicantTable({ applicants, disablePortal = false }: ApplicantTableProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantCandidate | null>(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  const handleSelectApplicant = (applicant: ApplicantCandidate) => {
    if (!disablePortal) {
      setSelectedApplicant(applicant);
      setIsPortalOpen(true);
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
          {applicants.map((ApplicantCandidate) => (
            <TableRow 
              key={ApplicantCandidate.id} 
              onClick={() => handleSelectApplicant(ApplicantCandidate)} 
              className="cursor-pointer"
            >
              <TableCell>{`${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`}</TableCell>
              <TableCell>{ApplicantCandidate.jobs[0]?.name || 'No job specified'}</TableCell>
              <TableCell>{ApplicantCandidate.candidate.email_addresses[0]?.value || 'No email address'}</TableCell>
              <TableCell>{ApplicantCandidate.candidate.phone_numbers[0]?.value || 'No phone number'}</TableCell>
              <TableCell>{new Date(ApplicantCandidate.applied_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!disablePortal && (
        <Dialog open={isPortalOpen} onOpenChange={setIsPortalOpen}>
          <DialogContent className="max-w-6xl h-[80vh] overflow-y-auto">
            {selectedApplicant && (
              <ApplicantPortal
                ApplicantCandidate={selectedApplicant}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}