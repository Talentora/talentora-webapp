'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ApplicantCandidate } from "@/types/greenhouse"
import ApplicantPortal from '@/components/Applicants/Applicant/ApplicantPortal';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EllipsisIcon } from 'lucide-react';

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
    <div className="border border-gray-200 rounded-lg">
      <Table className="border rounded-lg">
        <TableHeader className="bg-accent rounded-lg">
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
          {applicants.map((ApplicantCandidate) => (
            <TableRow 
              key={ApplicantCandidate.id} 
              onClick={() => handleSelectApplicant(ApplicantCandidate)} 
              className="cursor-pointer bg-foreground"
            >
              <TableCell>{`${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`}</TableCell>
              <TableCell>{ApplicantCandidate.jobs[0]?.name || 'No job specified'}</TableCell>
              <TableCell>{ApplicantCandidate.candidate.email_addresses[0]?.value || 'No email address'}</TableCell>
              <TableCell>8</TableCell>
              <TableCell>10</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell className="underline">View Report</TableCell>

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