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
import { Tables } from '@/types/types_db';

type CombinedJob = {
  mergeJob: Job;
  supabaseJob?: Tables<'jobs'>;
};

interface InviteApplicantsProps {
  jobs?: CombinedJob[];
  singleJobFlag?: boolean;
  applicants: ApplicantCandidate[];
}

const InviteApplicants = ({ jobs, singleJobFlag, applicants }: InviteApplicantsProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<ApplicantCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>(
    singleJobFlag && jobs && jobs.length > 0 ? jobs[0].mergeJob.id : ''
  );
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
    if (!selectedJobId) {
      toast({
        title: 'Error',
        description: 'Please select a job first',
        variant: 'destructive'
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
    <div className="flex-1">
      <Card className="p-5 bg-foreground border border-border shadow-3xl h-full relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Sparkle decorations */}
        <div className="absolute top-3 right-3 animate-[spin_3s_linear_infinite]">
          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
        </div>
        
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3 group">
              <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                Invite Applicants
              </CardTitle>
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-center font-medium">
              Start interviewing candidates with AI-powered assessments
            </p>
            <Button 
              onClick={() => setShowInviteDialog(true)} 
              className="mt-4 w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
              hover:to-blue-700 transition-all duration-300 transform hover:scale-105 
              hover:shadow-lg relative group"
            >
              <span className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-300 
              opacity-20 group-hover:opacity-30 blur transition-all duration-300"></span>
              <span className="relative">Invite Candidates</span>
            </Button>
          </div>

          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Select Candidates to Invite</DialogTitle>
                <DialogDescription>
                  Choose the candidates you'd like to invite for an AI interview
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                

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
                    <SelectTrigger className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                      <SelectValue placeholder="Select a job to invite candidates" className="text-blue-700 font-medium" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-blue-200 shadow-lg">
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
                          className="hover:bg-gray-50 cursor-pointer"
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
                      variant="outline"
                      onClick={() => setShowInviteDialog(false)}
                    >
                      Cancel
                    </Button>
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
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteApplicants;
