import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, Dialog } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableFooter } from '@/components/ui/table';
import { Input } from '@/components/ui/input'; // Added for search functionality
import { inviteCandidate } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { ApplicantCandidate } from '@/types/merge';
interface InviteApplicantsProps {
  jobId: string;
  applicants: ApplicantCandidate[];
}

const InviteApplicants = ({ jobId, applicants }: InviteApplicantsProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<ApplicantCandidate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Added for search functionality
  const applicantsPerPage = 25;
  const { toast } = useToast(); // Assuming useToast is imported and available


  const handleInvite = () => {
    // TO DO: implement invite logic
    console.log('Invite applicants:', selectedApplicants);
    

    selectedApplicants.forEach(async (applicant) => {
      const name = applicant.candidate.first_name + ' ' + applicant.candidate.last_name;
      const email = applicant.candidate.email_addresses[0].value;
      const candidate_id = applicant.candidate.id;
      const inviteResult = await inviteCandidate(
        name, email, candidate_id, jobId);
      if (inviteResult.error) {
        toast({ variant: 'destructive', title: 'Error', description: inviteResult.error });
      } else {
        toast({ variant: 'default', title: 'Success', description: `Invite sent to ${name} (${email})` });
      }
    });
  };

  const handleInviteAll = () => {
    setSelectedApplicants(applicants);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }; // Added for search functionality

  const filteredApplicants = applicants.filter(applicant => 
    applicant.candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    applicant.candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    applicant.candidate.email_addresses[0].value.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Added for search functionality

  const paginatedApplicants = filteredApplicants.slice((currentPage - 1) * applicantsPerPage, currentPage * applicantsPerPage);

  return (
    <div className="flex-1">
      <Card className="p-5 bg-foreground border border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Invite Applicants</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogHeader>
              <DialogDescription>Select applicants to invite for an interview.</DialogDescription>

              <Button onClick={() => setShowInviteDialog(true)} className="mt-4 w-1/4">Invite</Button>

            </DialogHeader>
            <DialogContent>
              <div className="flex flex-col justify-between m-4 gap-5">
                <DialogTitle>Invite Applicants</DialogTitle>
                <div className="flex flex-col gap-4">
                  <DialogDescription>Select applicants to invite for an interview.</DialogDescription>
                  <div className="mb-4 flex flex-row justify-between items-center gap-5">
                <Input 
                  placeholder="Search applicants..." 
                  value={searchTerm} 
                  onChange={handleSearch} 
                  className="w-full"
                  
                /> {/* Added for search functionality */}
                <Button onClick={handleInviteAll} className="w-1/4">Select All</Button>
              </div>
                </div>
              </div>
             
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Select</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>{applicant.candidate.first_name + ' ' + applicant.candidate.last_name}</TableCell>
                      <TableCell>{applicant.candidate.email_addresses[0].value}</TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedApplicants.includes(applicant)}
                          onChange={() => {
                            if (selectedApplicants.includes(applicant)) {
                              setSelectedApplicants(selectedApplicants.filter((a) => a.id !== applicant.id));
                            } else {
                              setSelectedApplicants([...selectedApplicants, applicant]);
                            }
                          }}
                        />
                      
                      </TableCell>
                    </TableRow>
                  ))}
                 
                </TableBody>
                {filteredApplicants.length > applicantsPerPage && (
                  <TableFooter>
                    <div className="flex flex-row justify-between items-center mt-2">
                      <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                      <span className="mx-1">{currentPage} of {Math.ceil(filteredApplicants.length / applicantsPerPage)}</span> {/* Updated to use filteredApplicants */}
                      <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(filteredApplicants.length / applicantsPerPage)}>Next</Button> {/* Updated to use filteredApplicants */}
                    </div>
                  </TableFooter>
                )}
              </Table>
              
              <Button onClick={handleInvite} disabled={selectedApplicants.length === 0}>Invite Selected</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteApplicants;

