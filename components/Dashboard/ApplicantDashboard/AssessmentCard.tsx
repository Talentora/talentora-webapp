import { memo, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { EnrichedApplication } from '@/hooks/useApplicant';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface AssessmentCardProps {
  application: EnrichedApplication;
}

const AssessmentCard = memo<AssessmentCardProps>(({ application }) => {
  // Memoize the formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    return new Date(application.created_at).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  }, [application.created_at]);

  // Memoize the status class to prevent recalculation
  const statusClass = useMemo(() => {
    return application.status === 'complete'
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
  }, [application.status]);

  return (
    <Card className="border p-5 border-border shadow-sm relative">
      <div className="absolute top-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Company Information</h4>
                <p className="text-sm text-muted-foreground">
                  {application.company?.name}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Job Description</h4>
                <div className="max-h-[200px] overflow-y-auto prose prose-sm">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        application.description || 'No description available'
                    }}
                    className="text-sm text-muted-foreground whitespace-pre-wrap"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <p className="text-sm text-muted-foreground">
                  {application.status}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {application.name}
        </CardTitle>
        <div className="flex flex-row gap-1">
          <p className="text-sm text-muted-foreground">
            {application.company?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Posted: {formattedDate}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          Application Status:
          <span className={statusClass}>{application.status}</span>
        </div>
        <div className="flex gap-3">
          <Link href={`/assessment/${application.application_data.id}`}>
            <Button
              className="bg-[#6366f1] hover:bg-[#5558e6]"
              disabled={application.status === 'complete'}
            >
              Start Interview
            </Button>
          </Link>
          <Link href={`/mock/${application.application_data.id}`}>
            <Button
              className="text-[#6366f1] bg-white hover:bg-gray-100 border border-[#6366f1] hover:border-[#5558e6]"
              // disabled={application.status === 'complete'}
            >
              Mock Interview
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

AssessmentCard.displayName = 'AssessmentCard';

export default AssessmentCard;
