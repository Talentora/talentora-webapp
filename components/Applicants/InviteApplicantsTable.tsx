"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { inviteCandidate } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';

// Import subcomponents
import ApplicantTableHeader from './ApplicantTableHeader';
import ApplicantFilters from './ApplicantFilters';
import ApplicantJobInfo from './ApplicantJobInfo';
import ApplicantTablePagination from './ApplicantTablePagination';
import { getApplicantColumns } from './ApplicantTableColumns';

interface InviteApplicantsTableProps {
  applicants: any[];
  jobs: any[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const InviteApplicantsTable = ({ applicants, jobs, onSort, sortField, sortDirection }: InviteApplicantsTableProps) => {
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [isInviting, setIsInviting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    status: false,
    dataStatus: false
  });
  const [rowSelection, setRowSelection] = useState({});
  const { toast } = useToast();
  const router = useRouter();

  // Additional filters
  const [invitationStatus, setInvitationStatus] = useState<string>("all");
  const [interviewStatus, setInterviewStatus] = useState<string>("all");
  const [scoreThreshold, setScoreThreshold] = useState<number[]>([0, 100]);

  const handleViewApplicant = (applicant: any) => {
    // Check if application ID exists
    if (!applicant.application?.id) {
      toast({
        title: 'Error',
        description: 'Cannot view details: No application ID available',
        variant: 'destructive'
      });
      return;
    }
    router.push(`/applicants/${applicant.application.id}`);
  };

  const handleInvite = async () => {
    if (selectedJobId === "all") {
      toast({
        title: 'Error',
        description: 'Please select a specific job to invite candidates.',
        variant: 'destructive'
      });
      return;
    }

    setIsInviting(true);
    try {
      for (const applicant of selectedApplicants) {
        // Skip if no candidate data
        if (!applicant.candidate) {
          toast({
            title: 'Error',
            description: 'Cannot invite applicant without candidate data',
            variant: 'destructive'
          });
          continue;
        }
        
        const name = `${applicant.candidate.first_name} ${applicant.candidate.last_name}`;
        const email = applicant.candidate.email_addresses?.[0]?.value;
        
        if (!email) {
          toast({
            title: 'Error',
            description: `No email found for ${name}`,
            variant: 'destructive'
          });
          continue;
        }
        
        const { error } = await inviteCandidate(name, email, selectedJobId);
        
        if (error) {
          toast({
            title: 'Error',
            description: `Failed to invite ${name}: ${error}`,
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
      setSelectedApplicants([]);
      setRowSelection({});
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

  // Define columns for the data table
  const columns = useMemo(() => {
    const cols = getApplicantColumns({ 
      selectedJobId, 
      handleViewApplicant,
      setSelectedApplicants 
    });

    // Find the status column and add custom sorting
    const statusColumn = cols.find(col => {
      return 'accessorKey' in col && col.accessorKey === 'status';
    });

    if (statusColumn && 'accessorKey' in statusColumn) {
      statusColumn.sortingFn = (rowA: any, rowB: any) => {
        const statusOrder: Record<string, number> = {
          'not_invited': 0,
          'in_progress': 1,
          'review_ready': 2
        };
        
        const statusA = (rowA.getValue('status') || 'not_invited') as string;
        const statusB = (rowB.getValue('status') || 'not_invited') as string;
        
        return statusOrder[statusA] - statusOrder[statusB];
      };
    }

    return cols;
  }, [selectedJobId]);

  // Filter applicants based on search term and selected job
  const filteredApplicants = useMemo(() => {
    return applicants.filter(applicant => {
      // For search term filtering
      let matchesSearch = true;
      if (searchTerm) {
        if (applicant.candidate) {
          const fullName = `${applicant.candidate.first_name} ${applicant.candidate.last_name}`.toLowerCase();
          matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            (applicant.candidate.email_addresses && 
             applicant.candidate.email_addresses[0]?.value.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
          // If no candidate data but there's a search term, can't match
          matchesSearch = false;
        }
      }
      
      // For job filtering
      let matchesJob = true;
      if (selectedJobId !== "all") {
        const jobId = applicant.job?.id;
        matchesJob = jobId === selectedJobId;
      }
      
      // For invitation status filtering
      let matchesInvitationStatus = true;
      if (invitationStatus !== "all") {
        const isInvited = Boolean(applicant.application?.invitation_sent);
        matchesInvitationStatus = (invitationStatus === "invited" && isInvited) || 
                                 (invitationStatus === "not_invited" && !isInvited);
      }
      
      // For interview status filtering
      let matchesInterviewStatus = true;
      if (interviewStatus !== "all") {
        // Check if there's a valid AI_summary property
        const hasInterview = Boolean(applicant.AI_summary) && 
          !(Array.isArray(applicant.AI_summary) && applicant.AI_summary.length === 0);
          
        matchesInterviewStatus = (interviewStatus === "completed" && hasInterview) || 
                                (interviewStatus === "not_completed" && !hasInterview);
      }
      
      // For score threshold filtering
      let matchesScoreThreshold = true;
      let score = null;
      
      // Extract score from AI_summary, always using the most recent one if it's an array
      let resumeScore = null;
      let technicalScore = null;
      let cultureFitScore = null;
      let communicationScore = null;
      
      if (applicant.AI_summary) {
        if (Array.isArray(applicant.AI_summary)) {
          if (applicant.AI_summary.length > 0) {
            // Sort by created_at date in descending order to get the most recent
            const sortedSummaries = [...applicant.AI_summary].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            // Use the most recent summary's score
            if (sortedSummaries[0]?.overall_summary?.score) {
              score = sortedSummaries[0].overall_summary.score;
              // Extract additional scores
              resumeScore = sortedSummaries[0].overall_summary?.resumeScore || null;
              technicalScore = sortedSummaries[0].overall_summary?.technicalScore || null;
              cultureFitScore = sortedSummaries[0].overall_summary?.cultureFitScore || null;
              communicationScore = sortedSummaries[0].overall_summary?.communicationScore || null;
            } else if (sortedSummaries[0]?.resume_analysis) {
              // If no overall score but resume analysis exists, don't filter out
              matchesScoreThreshold = true;
              return matchesSearch && matchesJob && matchesInvitationStatus && matchesInterviewStatus && matchesScoreThreshold;
            }
          }
        } else if (applicant.AI_summary?.overall_summary?.score) {
          score = applicant.AI_summary.overall_summary.score;
          // Extract additional scores
          resumeScore = applicant.AI_summary.overall_summary?.resumeScore || null;
          technicalScore = applicant.AI_summary.overall_summary?.technicalScore || null;
          cultureFitScore = applicant.AI_summary.overall_summary?.cultureFitScore || null;
          communicationScore = applicant.AI_summary.overall_summary?.communicationScore || null;
        } else if (applicant.AI_summary?.resume_analysis) {
          // If no overall score but resume analysis exists, don't filter out
          matchesScoreThreshold = true;
          return matchesSearch && matchesJob && matchesInvitationStatus && matchesInterviewStatus && matchesScoreThreshold;
        }
      }
      
      if (score !== null) {
        const numScore = parseFloat(score);
        if (!isNaN(numScore)) {
          matchesScoreThreshold = numScore >= scoreThreshold[0] && numScore <= scoreThreshold[1];
        }
      } else if (scoreThreshold[0] > 0) {
        // If we're filtering for scores above 0 but this applicant has no score
        matchesScoreThreshold = false;
      }
      
      return matchesSearch && matchesJob && matchesInvitationStatus && 
             matchesInterviewStatus && matchesScoreThreshold;
    });
  }, [applicants, searchTerm, selectedJobId, invitationStatus, interviewStatus, scoreThreshold]);

  // Reset selected applicants when filter changes
  useEffect(() => {
    setSelectedApplicants([]);
    setRowSelection({});
  }, [selectedJobId, invitationStatus, interviewStatus, scoreThreshold]);

  // Initialize the table
  const table = useReactTable({
    data: filteredApplicants,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Count active filters
  const activeFilterCount = [
    selectedJobId !== "all" ? 1 : 0,
    invitationStatus !== "all" ? 1 : 0,
    interviewStatus !== "all" ? 1 : 0,
    scoreThreshold[0] > 0 || scoreThreshold[1] < 100 ? 1 : 0,
    Object.keys(columnVisibility).length > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full space-y-1">
      {/* Header sections with reduced spacing */}
      <div className="space-y-1">
        <ApplicantTableHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedApplicants={selectedApplicants}
          isInviting={isInviting}
          handleInvite={handleInvite}
          selectedJobId={selectedJobId}
          setIsFilterOpen={setIsFilterOpen}
          activeFilterCount={activeFilterCount}
        />
        
        <ApplicantJobInfo
          selectedJobId={selectedJobId}
          jobs={jobs}
          filteredApplicantsCount={filteredApplicants.length}
        />
      </div>
      
      {/* Filter popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <ApplicantFilters
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          invitationStatus={invitationStatus}
          setInvitationStatus={setInvitationStatus}
          interviewStatus={interviewStatus}
          setInterviewStatus={setInterviewStatus}
          scoreThreshold={scoreThreshold}
          setScoreThreshold={setScoreThreshold}
          jobs={jobs}
          table={table}
          activeFilterCount={activeFilterCount}
        >
          <div className="pointer-events-auto">
            {/* This is just a placeholder for the PopoverTrigger */}
            <span className="hidden" />
          </div>
        </ApplicantFilters>
      </div>
      
      {/* Scrollable table section with constrained width */}
      <div className="flex-1 border rounded-lg overflow-hidden" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div className="overflow-auto h-full w-[calc(100vw-80px)] max-w-[1100px]">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="whitespace-nowrap py-2 px-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-2 px-3 truncate max-w-[200px]"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-16 text-center">
                    No candidates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination with less padding */}
      <div className="py-1">
        <ApplicantTablePagination table={table} />
      </div>
    </div>
  );
};

export default InviteApplicantsTable;