import { TableCell, TableRow } from '@/components/ui/table';
import { EnrichedJob } from './types';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export function JobRow({ job, visibleColumns }: { job: EnrichedJob; visibleColumns: string[] }) {
  const router = useRouter();
  const { interviewConfig } = job;

  const interviewQuestions: { question: string; sampleResponse: string }[] = interviewConfig?.interview_questions ? 
    (typeof interviewConfig.interview_questions === 'string' 
      ? JSON.parse(interviewConfig.interview_questions) 
      : interviewConfig.interview_questions) 
    : [];

  const hasBotId = !!interviewConfig?.bot_id;
  const hasQuestions = interviewQuestions.length > 0;
  const hasInterviewName = !!interviewConfig?.interview_name;
  const hasDuration = !!interviewConfig?.duration;

  const isReady = (hasBotId && hasQuestions && hasInterviewName && hasDuration) 
    ? "yes" 
    : (!hasBotId && !hasQuestions && !hasInterviewName && !hasDuration) 
      ? "no" 
      : "almost";

  return (
    <TooltipProvider>
      <TableRow onClick={() => router.push(`/jobs/${job.id}`)}>
        {visibleColumns.includes('id') && (
          <TableCell className="whitespace-nowrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{job.id.slice(0, 6)}...</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-primary">
                {job.id}
              </TooltipContent>
            </Tooltip>
          </TableCell>
        )}
        {visibleColumns.includes('name') && (
          <TableCell className="max-w-[200px] truncate">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{job.name}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-primary">
                {job.name}
              </TooltipContent>
            </Tooltip>
          </TableCell>
        )}
        {visibleColumns.includes('status') && (
          <TableCell className="whitespace-nowrap">
            <Badge variant={job.status.toLowerCase() === 'open' ? 'success' : 'secondary'}>
              {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase() : ''}
            </Badge>
          </TableCell>
        )}
        {visibleColumns.includes('created_at') && (
          <TableCell className="whitespace-nowrap">
            {new Date(job.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </TableCell>
        )}
        {visibleColumns.includes('configured') && (
          <TableCell className="whitespace-nowrap">
            <Badge 
              variant={isReady === "yes" ? "success" : isReady === "almost" ? "warning" : "failure"}
              className={`${isReady === "yes" ? "bg-green-700" : isReady === "almost" ? "bg-orange-700" : "bg-red-700"}`}
            >
              {isReady === "yes" ? "Ready" : isReady === "almost" ? "Almost Ready" : "Setup Required"}
            </Badge>
          </TableCell>
        )}
        {visibleColumns.includes('departments') && (
          <TableCell className="max-w-[200px]">
            <div className="flex gap-1 flex-wrap">
              {job.departments?.length ? (
                job.departments.filter(Boolean).map(dept => (
                  <Badge key={dept.name} variant="secondary" className="truncate">
                    {dept.name}
                  </Badge>
                ))
              ) : (
                'No department'
              )}
            </div>
          </TableCell>
        )}
        {visibleColumns.includes('offices') && (
          <TableCell className="max-w-[200px]">
            <div className="flex gap-1 flex-wrap">
              {job.offices?.length ? (
                job.offices.filter(Boolean).map(office => (
                  <Badge key={office.name} variant="secondary" className="truncate">
                    {office.name}
                  </Badge>
                ))
              ) : (
                'No office'
              )}
            </div>
          </TableCell>
        )}
      </TableRow>
    </TooltipProvider>
  );
}
