import { useState } from 'react';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Actions (update)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full">Schedule Interview</Button>
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
