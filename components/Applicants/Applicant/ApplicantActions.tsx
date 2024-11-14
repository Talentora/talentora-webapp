import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ApplicantCandidate } from '@/types/merge';
import { inviteCandidate } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast'; // Assuming this hook is available for toast notifications
export default function ApplicantActions({
  ApplicantCandidate
}: {
  ApplicantCandidate: ApplicantCandidate;
}) {
  const resumeUrl =
    // ApplicantCandidate.candidate.attachments?.find(
    //   (attachment) => attachment. === 'resume'
    // )?.url ||
    'No resume available';

  const { toast } = useToast(); // Using the hook to add toast notifications
  const firstName = ApplicantCandidate?.candidate?.first_name || '';
  const lastName = ApplicantCandidate?.candidate?.last_name || '';
  const candidateId = ApplicantCandidate?.candidate?.id || '';
  const emailAddress = ApplicantCandidate?.candidate?.email_addresses?.[0]?.value || '';

  
  async function onScheduleAIInterview() {
    
    // const name = `${firstName} ${lastName}`.trim();
    const name = 'Ben Gardiner';
    const emailAddress = 'ben@gardiner.com';

    if (!name || !emailAddress || !candidateId) {
      toast({
        title: 'Error',
        description: 'Name, email address, and candidate ID are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log(`Inviting candidate ${name}: ${emailAddress}`);

      const { data, error } = await inviteCandidate(name, emailAddress, candidateId);
      console.log('Response:', { data, error });

      if (error) {
        toast({
          title: 'Failed to invite candidate',
          description: error.message || 'An error occurred',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Candidate invited successfully',
        variant: 'default'
      });
    } catch (err) {
      console.error('Error inviting candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to invite candidate',
        variant: 'destructive'
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Actions (update)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={onScheduleAIInterview}>Schedule AI Interview</Button>
        <Button className="w-full" variant="outline">
          Send Message
        </Button>
        <div className="flex gap-2">
          <Button className="flex-1" size="icon" variant="outline">
            <ThumbsUp className="w-4 h-4" />
            <span className="sr-only">Approve</span>
          </Button>
          <Button className="flex-1" size="icon" variant="outline">
            <ThumbsDown className="w-4 h-4" />
            <span className="sr-only">Reject</span>
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full max-w-md mx-auto" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              View Resume
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resume</DialogTitle>
            </DialogHeader>
            {resumeUrl ? (
              <iframe src={resumeUrl} title="Resume" className="w-full h-96" />
            ) : (
              <div>No resume available</div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
