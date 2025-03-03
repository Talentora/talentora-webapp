import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, Dialog } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { inviteCandidate } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { ApplicantCandidate, Job } from '@/types/merge';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface InviteApplicantsProps {
  jobs?: any[];
  singleJobFlag?: boolean;
  applicants: ApplicantCandidate[];
}

const InviteApplicants = ({ jobs, singleJobFlag, applicants }: InviteApplicantsProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<ApplicantCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // const numberOfJobs = jobs && jobs.length > 0 ? jobs.length : 0;
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs?.[0]?.mergeJob.id ?? '');
  const { toast } = useToast();

  const filteredApplicants = applicants.filter(applicant => 
    applicant.candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.candidate.email_addresses[0].value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants);
    }
  };

  const handleInvite = async () => {
    // alert(`Invite to ${selectedJobId}`);
    if (!selectedJobId) {
      toast({
        title: 'Success',
        description: 'Invited candidate/s',
        variant: 'default'
      });
      return;
    }

    setIsInviting(true);
    try {
      for (const applicant of selectedApplicants) {
        const name = `${applicant.candidate.first_name} ${applicant.candidate.last_name}`;
        const email = applicant.candidate.email_addresses[0].value;
        const { error } = await inviteCandidate(name, email, selectedJobId);
        
        if (error) {
          toast({
            title: 'Error',
            description: `Failed to invite ${name}`,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Success',
            description: `Invited ${name}`,
            variant: 'default'
          });
        }
      }
      setShowInviteDialog(false);
      setSelectedApplicants([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invites',
        variant: 'destructive'
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div >
      <div className="w-full h-1/2 p-6  shadow-3xl rounded-lg">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Select Candidates to Invite</h2>
            <p className="text-gray-500">
              Choose the candidates you'd like to invite for an AI interview
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleSelectAll}
              variant="outline"
              className="whitespace-nowrap"
            >
              {selectedApplicants.length === filteredApplicants.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </div>

          {!singleJobFlag && jobs && jobs.length > 0 && (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="transition-all duration-300">
                <SelectValue placeholder="Select a job to invite candidates" className="font-medium" />
              </SelectTrigger>
              <SelectContent >
                {jobs.map((job) => (
                  <SelectItem 
                    key={job.mergeJob.id} 
                    value={job.mergeJob.id}
                    className="hover:bg-blue-50 cursor-pointer py-2 px-4"
                  >
                    {job.mergeJob.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-[50px]">Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow 
                    key={applicant.application.id}
                    className=" cursor-pointer"
                    onClick={() => {
                      setSelectedApplicants(prev =>
                        prev.includes(applicant)
                          ? prev.filter(a => a !== applicant)
                          : [...prev, applicant]
                      );
                    }}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(applicant)}
                        onChange={() => {}} // Handle change through row click
                        className="rounded border-gray-300 text-blue-600 
                        shadow-sm focus:border-blue-300 focus:ring 
                        focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </TableCell>
                    <TableCell>
                      {applicant.candidate.first_name} {applicant.candidate.last_name}
                    </TableCell>
                    <TableCell>{applicant.candidate.email_addresses[0].value}</TableCell>
                  </TableRow>
                ))}
                {filteredApplicants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No candidates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-gray-600">
              {selectedApplicants.length} candidate{selectedApplicants.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleInvite}
                disabled={selectedApplicants.length === 0 || isInviting}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
              >
                {isInviting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Invite (${selectedApplicants.length})`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteApplicants;


