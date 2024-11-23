import { TableCell, TableRow } from '@/components/ui/table';
import { EnrichedJob } from './JobList';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
export function JobRow({ job }: { job: EnrichedJob }) {
  const router = useRouter();
  const { interviewConfig } = job;

  const interviewQuestions: { question: string; sampleResponse: string }[] = interviewConfig?.interview_questions ? 
    (typeof interviewConfig.interview_questions === 'string' ? 
      JSON.parse(interviewConfig.interview_questions) : 
      interviewConfig.interview_questions) : [];

  const hasBotId = !!interviewConfig?.bot_id;
  const hasQuestions = interviewQuestions.length > 0;
  const hasInterviewName = !!interviewConfig?.interview_name;
  const hasDuration = !!interviewConfig?.duration;

  const isReady = (hasBotId && hasQuestions && hasInterviewName && hasDuration) ? "yes" : 
  (!hasBotId && !hasQuestions && !hasInterviewName && !hasDuration) ? "no" : "almost";

  return (
    <TooltipProvider>
      <TableRow onClick={() => router.push(`/jobs/${job.id}`)}>
        <TableCell className="text-center" title={job.id}>
          <Tooltip>
            <TooltipTrigger asChild><span>{job.id.slice(0, 6)}...</span></TooltipTrigger>
            <TooltipContent className="max-w-xs bg-foreground text-primary">{job.id}</TooltipContent>
          </Tooltip>
        </TableCell>
        <TableCell className="text-center">{job.name}</TableCell>
        <TableCell className="text-center">
          <Badge variant={job.status.toLowerCase() === 'open' ? 'success' : 'secondary'}>
          {job.status
            ? job.status.charAt(0).toUpperCase() +
              job.status.slice(1).toLowerCase()
            : ''}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {new Date(job.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={job.isConfigured ? 'success' : 'failure'}>
          {job.isConfigured ? 'Yes' : 'No'}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {job.departments?.length ? (
          <div className="flex gap-1 flex-wrap justify-center">
            {job.departments
              .filter(Boolean)
              .map(dept => (
                <Badge key={dept.name} variant="secondary">
                  {dept.name}
                </Badge>
              ))}
          </div>
        ) : (
          'No department'
        )}
      </TableCell>
      <TableCell className="text-center">
        {job.offices?.length ? (
          <div className="flex gap-1 flex-wrap justify-center">
            {job.offices
              .filter(Boolean)
              .map(office => (
                <Badge key={office.name} variant="secondary">
                  {office.name}
                </Badge>
              ))}
          </div>
        ) : (
          'No office'
        )}
      </TableCell>
    </TableRow>
    </TooltipProvider>
  );
}
