'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
// import { inviteRecruiter } from '@/utils/supabase/queries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Job } from '@/types/merge';
import { inviteCandidate, inviteRecruiter } from '@/utils/supabase/queries';
import { Skeleton } from '@/components/ui/skeleton';

interface InvitePageProps {
  jobs: Job[];
  isLoading: boolean;
}

export default function InvitePage({ jobs, isLoading }: InvitePageProps) {
  const [emails, setEmails] = useState('');
  const [names, setNames] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmails = (
    emailList: string[]
  ): { validEmails: string[]; invalidEmails: string[] } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emailList.filter((email) => emailRegex.test(email));
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));
    return { validEmails, invalidEmails };
  };

  useEffect(() => {
    console.log('Jobs received in InvitePage:', jobs);
  }, [jobs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJobId) {
      setStatus('error');
      setErrorMessage('Please select a job before sending invitations.');
      return;
    }

    const emailList = emails
      .split(/[\s,]+/)
      .filter((email) => email.trim() !== '');
    const { validEmails, invalidEmails } = validateEmails(emailList);

    if (invalidEmails.length > 0) {
      setStatus('error');
      setErrorMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
      return;
    }

    const nameList = names.split('\n').filter((name) => name.trim() !== '');
    

    try {
      for (const [index, email] of validEmails.entries()) {
        const name = nameList[index] || 'Unnamed Candidate';
        const mergeApplicantId = ;
        const { data, error } = await inviteCandidate(
          name,
          email,
          selectedJobId,
          merge_applicant_id
        );
        if (!data) {
          throw new Error(`Failed to send invitation to ${email}`);
        }
      }

      setStatus('success');
      setEmails('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send invitations. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-black">Invite Candidates</CardTitle>
        <CardDescription className="text-black">
          Select a job and enter email addresses to invite candidates for the
          assessment.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="job-select"
              className="text-sm font-medium text-black"
            >
              Select Job
            </label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select onValueChange={setSelectedJobId} value={selectedJobId}>
                <SelectTrigger id="job-select">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email-textarea"
              className="text-sm font-medium text-black"
            >
              Candidate Emails
            </label>
            <Textarea
              id="email-textarea"
              placeholder="Enter email addresses (separated by commas or new lines)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name-textarea"
              className="text-sm font-medium text-black"
            >
              Candidate Name
            </label>
            <Textarea
              id="name-textarea"
              placeholder="Enter name"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            Send Invitations
          </Button>
        </CardFooter>
      </form>
      {status === 'error' && (
        <Alert intent="danger" title="Error">
          <AlertDescription className="text-black">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      {status === 'success' && (
        <Alert intent="info" title="Success">
          <AlertDescription className="text-black">
            Invitations sent successfully!
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
