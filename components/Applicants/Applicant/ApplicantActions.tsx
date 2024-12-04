import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplicantCandidate } from '@/types/merge';
import { inviteCandidate, getJobInterviewConfig } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Function to fetch the resume URL from the backend API route
const fetchAttachmentDetails = async (attachmentId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/merge/resume?attachmentId=${attachmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch attachment details');
    }
    const data: { file_url?: string } = await response.json();
    return data.file_url || null;
  } catch (error) {
    console.error('Error fetching attachment details:', error);
    return null;
  }
};

// Component for fetching and displaying attachment details
const AttachmentFetcher: React.FC<{ attachmentId: string }> = ({ attachmentId }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await fetchAttachmentDetails(attachmentId);
        if (url) {
          setFileUrl(url);
        } else {
          setError('Resume URL not found');
        }
      } catch (err) {
        setError('An error occurred while fetching the attachment');
      }
    };

    fetchData();
  }, [attachmentId]);

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : fileUrl ? (
        <iframe src={fileUrl} title="Resume" className="w-full h-96" />
      ) : (
        <div>Loading resume...</div>
      )}
    </div>
  );
};

export default function ApplicantActions({
  ApplicantCandidate,
}: {
  ApplicantCandidate: ApplicantCandidate;
}) {
  const { toast } = useToast();
  const [isInterviewReady, setIsInterviewReady] = useState(false);
  const firstName = ApplicantCandidate?.candidate?.first_name || '';
  const lastName = ApplicantCandidate?.candidate?.last_name || '';
  const candidateId = ApplicantCandidate?.candidate?.id || '';
  const emailAddress =
    ApplicantCandidate?.candidate?.email_addresses?.[0]?.value || '';
  const resumeAttachmentId =
    ApplicantCandidate?.candidate?.attachments?.[0]; // Assume it's an attachment ID.

  const jobId = ApplicantCandidate?.job?.id || '';

  useEffect(() => {
    const checkInterviewConfig = async () => {
      if (!jobId) return;
      
      const config = await getJobInterviewConfig(jobId);
      const isReady = !!(config?.bot_id && config?.interview_questions && 
                        config?.interview_name && config?.duration);
      setIsInterviewReady(isReady);
    };

    checkInterviewConfig();
  }, [jobId]);

  async function onScheduleAIInterview() {
    const name = `${firstName} ${lastName}`.trim();

    if (!name || !emailAddress || !candidateId) {
      toast({
        title: 'Error',
        description: 'Name, email address, and candidate ID are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log(`Inviting candidate ${name}: ${emailAddress}`);

      const { data, error } = await inviteCandidate(
        name,
        emailAddress,
        jobId
      );
      console.log('Response:', { data, error });

      if (error) {
        toast({
          title: 'Failed to invite candidate',
          description: error || 'An error occurred',
          variant: 'destructive'
        });
        return;
      }
      toast({
        title: 'Success',
        description: 'Candidate invited successfully',
        variant: 'default',
      });
    } catch (err) {
      console.error('Error inviting candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to invite candidate',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Actions (Updated)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  className="w-full" 
                  onClick={onScheduleAIInterview}
                  disabled={!isInterviewReady}
                >
                  Schedule AI Interview
                </Button>
              </div>
            </TooltipTrigger>
            {!isInterviewReady && (
              <TooltipContent className="text-sm bg-red-500 text-white p-2 rounded-md">
                <p >Please complete the interview configuration in job settings before inviting candidates</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
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
            {resumeAttachmentId ? (
              <AttachmentFetcher attachmentId={resumeAttachmentId} />
            ) : (
              <div>No resume available</div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
