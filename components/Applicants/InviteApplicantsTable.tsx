"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApplicantCandidate } from "@/types/merge";
import { Loader2, Search, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { inviteCandidate } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Global variable for max rows per page
const MAX_ROWS_PER_PAGE = 10;

interface InviteApplicantsTableProps {
  applicants: ApplicantCandidate[];
  jobs?: any[];
}

// Helper function to determine if an applicant has completed an interview
const hasCompletedInterview = (applicant: ApplicantCandidate): boolean => {
  // Check if there's an AI_summary property or related data
  return Boolean((applicant as any).AI_summary);
};

// Helper function to determine if an applicant has been invited
const hasBeenInvited = (applicant: ApplicantCandidate): boolean => {
  // Check if there's an invitation_sent property in the application
  return Boolean((applicant.application as any).invitation_sent);
};

// Helper function to get status badge
const getStatusBadge = (applicant: ApplicantCandidate) => {
  if (hasCompletedInterview(applicant)) {
    return <Badge variant="success">Interview Completed</Badge>;
  } else if (hasBeenInvited(applicant)) {
    return <Badge variant="warning">Invited</Badge>;
  } else {
    return <Badge variant="outline">Not Invited</Badge>;
  }
};

const InviteApplicantsTable = ({ applicants, jobs }: InviteApplicantsTableProps) => {
  const [selectedApplicants, setSelectedApplicants] = useState<ApplicantCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Single job selector that serves both as filter and invitation target
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [isInviting, setIsInviting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const availableColumns = ['select', 'name', 'appliedFor', 'email', 'status', 'action'];
  const [selectedColumns, setSelectedColumns] = useState<string[]>(availableColumns); // All selected by default
  const { toast } = useToast();
  const router = useRouter();

  // Filter applicants based on search term and selected job
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.candidate.email_addresses[0].value.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If "all" is selected, show all applicants that match the search
    if (selectedJobId === "all") {
      return matchesSearch;
    }
    
    // Otherwise, filter by the selected job
    const jobId = applicant.job?.id;
    return matchesSearch && jobId === selectedJobId;
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredApplicants.length / MAX_ROWS_PER_PAGE);

  // Reset selected applicants when filter changes
  useEffect(() => {
    setSelectedApplicants([]);
  }, [selectedJobId]);

  const handleSelectApplicant = (applicant: ApplicantCandidate) => {
    setSelectedApplicants(prev =>
      prev.includes(applicant)
        ? prev.filter(a => a !== applicant)
        : [...prev, applicant]
    );
  };

  const handleViewApplicant = (applicant: ApplicantCandidate) => {
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
        const name = `${applicant.candidate.first_name} ${applicant.candidate.last_name}`;
        const email = applicant.candidate.email_addresses[0].value;
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

  // Get job name by ID
  const getJobNameById = (jobId: string): string => {
    if (!jobs) return "Unknown Job";
    if (jobId === "all") return "All Jobs";
    
    for (const job of jobs) {
      const id = job.mergeJob?.id || job.id;
      const name = job.mergeJob?.name || job.name;
      
      if (id === jobId) {
        return name || "Unknown Job";
      }
    }
    
    return "Unknown Job";
  };

  // Function to toggle a column selection
  const toggleColumnSelection = (column: string) => {
    if (column === 'select') {
      setSelectedColumns([column, ...selectedColumns.filter(c => c !== column)]);
    } else {
      setSelectedColumns(prev => 
        prev.includes(column)
          ? prev.filter(c => c !== column)
          : [column, ...prev]
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Combined job selector */}
          {jobs && jobs.length > 0 && (
            <div className="flex items-center gap-2">
              {/* <Filter className="h-4 w-4 text-gray-500" /> */}
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => {
                    const jobId = job.mergeJob?.id || job.id;
                    const jobName = job.mergeJob?.name || job.name;
                    
                    if (!jobId || !jobName) return null;
                    
                    return (
                      <SelectItem key={jobId} value={jobId}>
                        {jobName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Column selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Columns ({selectedColumns.length})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4 bg-background">
              <div className="space-y-2">
                {availableColumns.map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`column-${column}`} 
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={() => toggleColumnSelection(column)}
                    />
                    <Label htmlFor={`column-${column}`} className="cursor-pointer">
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleInvite} 
            disabled={selectedApplicants.length === 0 || isInviting || selectedJobId === "all"}
            className="whitespace-nowrap"
          >
            {isInviting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Invite ({selectedApplicants.length})
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {filteredApplicants.length} candidate{filteredApplicants.length !== 1 ? 's' : ''} found
        </div>
        {selectedJobId !== "all" && (
          <div className="text-sm">
            Inviting to: <span className="font-medium">{getJobNameById(selectedJobId)}</span>
          </div>
        )}
      </div>
      
      <Table className="border border-transparent rounded-lg">
        <TableHeader>
          <TableRow>
            {selectedColumns.map((column) => (
              <TableHead key={column}>{column.charAt(0).toUpperCase() + column.slice(1)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplicants.slice((currentPage - 1) * MAX_ROWS_PER_PAGE, currentPage * MAX_ROWS_PER_PAGE).map((applicant) => (
            <TableRow key={applicant.application.id} className="cursor-pointer">
              {selectedColumns.map((column) => (
                column === 'select' ? (
                  <TableCell key={column} onClick={(e) => {
                    e.stopPropagation();
                    handleSelectApplicant(applicant);
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedApplicants.includes(applicant)}
                      onChange={() => {}}
                      className="rounded border-gray-300"
                      disabled={selectedJobId !== "all" && applicant.job?.id !== selectedJobId}
                    />
                  </TableCell>
                ) : column === 'name' ? (
                  <TableCell key={column}>
                    {applicant.candidate.first_name} {applicant.candidate.last_name}
                  </TableCell>
                ) : column === 'appliedFor' ? (
                  <TableCell key={column}>
                    {applicant.job?.name || "No job specified"}
                  </TableCell>
                ) : column === 'email' ? (
                  <TableCell key={column}>
                    {applicant.candidate.email_addresses?.[0]?.value || "No email address"}
                  </TableCell>
                ) : column === 'status' ? (
                  <TableCell key={column}>
                    {getStatusBadge(applicant)}
                  </TableCell>
                ) : column === 'action' ? (
                  <TableCell key={column}>
                    <Button 
                      variant="link" 
                      onClick={() => handleViewApplicant(applicant)}
                      className="p-0 h-auto font-normal underline"
                    >
                      View Details
                    </Button>
                  </TableCell>
                ) : null
              ))}
            </TableRow>
          ))}
          {filteredApplicants.length === 0 && (
            <TableRow>
              <TableCell colSpan={selectedColumns.length} className="text-center py-8 text-gray-500">
                No candidates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4 items-center">
        <Button 
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500">{currentPage} of {totalPages}</span>
        <Button 
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InviteApplicantsTable;