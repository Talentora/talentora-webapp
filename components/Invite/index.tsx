'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inviteUser } from '@/utils/supabase/queries';  // Import the invite function
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface InvitePageProps {
  jobs: Job[];
}

export default function InvitePage({ jobs }: InvitePageProps) {
  const [emails, setEmails] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmails = (emailList: string[]): { validEmails: string[], invalidEmails: string[] } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emailList.filter((email) => emailRegex.test(email));
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));
    return { validEmails, invalidEmails };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob) {
      setStatus('error');
      setErrorMessage('Please select a job before sending invitations.');
      return;
    }

    const emailList = emails.split(/[\s,]+/).filter((email) => email.trim() !== '');
    const { validEmails, invalidEmails } = validateEmails(emailList);

    if (invalidEmails.length > 0) {
      setStatus('error');
      setErrorMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
      return;
    }

    try {
      for (const email of validEmails) {
        const response = await inviteUser(email);  // Use the inviteUser function directly in the client component

        if (!response.success) {
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
        <CardTitle>Invite Candidates</CardTitle>
        <CardDescription>Select a job and enter email addresses to invite candidates for the assessment.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="job-select" className="text-sm font-medium">Select Job</label>
            <Select onValueChange={setSelectedJob} value={selectedJob}>
              <SelectTrigger id="job-select">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="email-textarea" className="text-sm font-medium">Candidate Emails</label>
            <Textarea
              id="email-textarea"
              placeholder="Enter email addresses (separated by commas or new lines)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" className="w-full">Send Invitations</Button>
        </CardFooter>
      </form>

      {status === 'error' && <Alert variant="destructive">{errorMessage}</Alert>}
      {status === 'success' && <Alert variant="info">Invitations sent successfully!</Alert>}
    </Card>
  );
}