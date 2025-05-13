import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { ResumeScoreBadge } from './ApplicantTableColumns';
import { Badge } from '@/components/ui/badge';

// Helper function to get score from AI summary
const getAISummaryScore = (applicant: any): string | null => {
  if (!applicant.ai_summary) return null;

  if (Array.isArray(applicant.ai_summary) && applicant.ai_summary.length > 0) {
    const sortedSummaries = [...applicant.ai_summary].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Try to get score from the latest summary
    const latestSummary = sortedSummaries[0];
    if (typeof latestSummary.overall_summary === 'string') {
      try {
        const parsed = JSON.parse(latestSummary.overall_summary);
        return parsed.score;
      } catch (e) {
        return null;
      }
    }

    return latestSummary?.overall_summary?.score ?? null;
  }

  // Handle single AI summary object
  if (typeof applicant.ai_summary.overall_summary === 'string') {
    try {
      const parsed = JSON.parse(applicant.ai_summary.overall_summary);
      return parsed.score;
    } catch (e) {
      return null;
    }
  }

  return applicant.ai_summary?.overall_summary?.score ?? null;
};

// Helper function to get resume analysis scores
const getResumeAnalysisScore = (
  applicant: any,
  scoreType: string
): number | null => {
  if (!applicant.ai_summary) return null;

  if (Array.isArray(applicant.ai_summary) && applicant.ai_summary.length > 0) {
    const sortedSummaries = [...applicant.ai_summary].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const latestSummary = sortedSummaries[0];

    return (
      latestSummary?.resume_analysis?.[scoreType] ||
      latestSummary?.overall_summary?.[scoreType] ||
      null
    );
  }

  return (
    applicant.ai_summary.resume_analysis?.[scoreType] ||
    applicant.ai_summary.overall_summary?.[scoreType] ||
    applicant.ai_summary[scoreType] ||
    null
  );
};

interface GetCompletedColumnsProps {
  handleViewApplicant: (applicant: any) => void;
  setSelectedApplicants: React.Dispatch<React.SetStateAction<any[]>>;
}

export const getCompletedColumns = ({
  handleViewApplicant,
  setSelectedApplicants
}: GetCompletedColumnsProps): ColumnDef<any>[] => [
  {
    id: 'select',
    header: ({ table }: any) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { candidate } = row.original;
      return candidate
        ? `${candidate.first_name} ${candidate.last_name}`
        : 'Unknown Candidate';
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.candidate?.first_name || '';
      const b = rowB.original.candidate?.first_name || '';
      return a.localeCompare(b);
    },
    size: 150
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.candidate?.email_addresses?.[0]?.value || 'No email address',
    enableSorting: true,
    size: 200,
    sortingFn: (rowA, rowB) => {
      const emailA =
        rowA.original.candidate?.email_addresses?.[0]?.value?.toLowerCase() ||
        '';
      const emailB =
        rowB.original.candidate?.email_addresses?.[0]?.value?.toLowerCase() ||
        '';
      return emailA.localeCompare(emailB);
    }
  },
  {
    accessorKey: 'score',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Overall Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      const score = getAISummaryScore(applicant);

      return score !== null && !isNaN(parseFloat(score as string)) ? (
        <ResumeScoreBadge score={parseFloat(score as string)} />
      ) : (
        <span className="text-gray-400">N/A</span>
      );
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      const scoreA = getAISummaryScore(rowA.original);
      const scoreB = getAISummaryScore(rowB.original);

      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;

      return parseFloat(scoreA as string) - parseFloat(scoreB as string);
    }
  },
  {
    accessorKey: 'resumeScore',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Resume Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = getResumeAnalysisScore(row.original, 'resumeScore');
      return (
        <div className="flex justify-center">
          {score === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            <Badge
              variant={
                score >= 80
                  ? 'success'
                  : score >= 60
                    ? 'warning'
                    : 'destructive'
              }
            >
              {score}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      const scoreA = getResumeAnalysisScore(rowA.original, 'resumeScore');
      const scoreB = getResumeAnalysisScore(rowB.original, 'resumeScore');

      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;

      return scoreA - scoreB;
    }
  },
  {
    accessorKey: 'interviewDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Completed On
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      let completedDate = null;

      const applicant = row.original;
      if (applicant.ai_summary) {
        if (
          Array.isArray(applicant.ai_summary) &&
          applicant.ai_summary.length > 0
        ) {
          // Get the most recent summary
          const sortedSummaries = [...applicant.ai_summary].sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
          completedDate = sortedSummaries[0].updated_at;
        } else if (applicant.ai_summary.created_at) {
          completedDate = applicant.ai_summary.updated_at;
        }
      }

      if (!completedDate) return 'Unknown date';

      return new Date(completedDate).toLocaleDateString();
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      let dateA = 0;
      let dateB = 0;

      const applicantA = rowA.original;
      const applicantB = rowB.original;

      if (applicantA.ai_summary) {
        if (
          Array.isArray(applicantA.ai_summary) &&
          applicantA.ai_summary.length > 0
        ) {
          const sortedSummariesA = [...applicantA.ai_summary].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          dateA = new Date(sortedSummariesA[0].created_at).getTime();
        } else if (applicantA.ai_summary.created_at) {
          dateA = new Date(applicantA.ai_summary.created_at).getTime();
        }
      }

      if (applicantB.ai_summary) {
        if (
          Array.isArray(applicantB.ai_summary) &&
          applicantB.ai_summary.length > 0
        ) {
          const sortedSummariesB = [...applicantB.ai_summary].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          dateB = new Date(sortedSummariesB[0].created_at).getTime();
        } else if (applicantB.ai_summary.created_at) {
          dateB = new Date(applicantB.ai_summary.created_at).getTime();
        }
      }

      return dateA - dateB;
    }
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => handleViewApplicant(row.original)}
          className="p-0 h-auto font-normal underline"
        >
          View Details
        </Button>
      );
    },
    enableSorting: false,
    size: 100
  },
  {
    id: 'accept',
    header: 'Hire',
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-300 transition-colors flex items-center gap-1"
          onClick={() => {
            // Empty for now, will implement accept functionality later
            console.log('Accept applicant:', row.original);
          }}
        >
          <CheckCircle2 className="h-4 w-4" />
          Accept
        </Button>
      );
    },
    enableSorting: false,
    size: 100
  }
];
