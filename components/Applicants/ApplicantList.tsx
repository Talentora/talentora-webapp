'use client';

import { useState, useEffect, useMemo } from 'react';
import InviteApplicantsTable from '@/components/Applicants/InviteApplicantsTable';
import { Loader2, Send, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { fetchJobsData } from '@/server/jobs';
import { fetchApplicationsByJobId } from '@/server/applications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getNotInvitedColumns } from './NotInvitedColumns';
import { getInProgressColumns } from './InProgressColumns';
import { getCompletedColumns } from './CompletedColumns';

export default function ApplicantList() {
  const [applicantCandidates, setApplicantCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<string>('not-invited');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('');

  // Fetch jobs data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await fetchJobsData();
        setJobs(jobsData);

        // Set the first job as default selected job
        if (jobsData.length > 0) {
          setSelectedJobFilter(jobsData[jobsData.length - 1].id);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applications when selected job changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJobFilter) return;

      console.log('Fetching applications for job ID:', selectedJobFilter);

      setIsLoading(true);
      try {
        // merge API call
        const applicationsData =
          await fetchApplicationsByJobId(selectedJobFilter);
        console.log('fetchApplicationsByJobId:', applicationsData);
        setApplicantCandidates(applicationsData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobFilter]);

  // v1
  // Filter applicants based on status
  const notInvitedApplicants = useMemo(
    () =>
      applicantCandidates.filter(
        (app) =>
          app.application?.supabase_application_id &&
          (app.application?.status === 'not_invited' ||
            !app.application?.status)
      ),
    [applicantCandidates]
  );

  const inProgressApplicants = useMemo(
    () =>
      applicantCandidates.filter(
        (app) =>
          app.application?.supabase_application_id &&
          app.application?.status === 'pending_interview'
      ),
    [applicantCandidates]
  );

  const completedApplicants = useMemo(
    () =>
      applicantCandidates.filter(
        (app) =>
          app.application?.supabase_application_id &&
          app.application?.status === 'interview_completed'
      ),
    [applicantCandidates]
  );

  // Filter based on search term and apply sorting
  const filterAndSortApplicants = (applicants: any[]) => {
    return applicants
      .filter((app: any) => {
        if (!searchTerm) return true;
        if (!app.candidate) return false;

        const fullName =
          `${app.candidate.first_name} ${app.candidate.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
      .sort((a: any, b: any) => {
        if (sortField === 'status') {
          const statusA = getStatusPriority(a);
          const statusB = getStatusPriority(b);
          return sortDirection === 'asc'
            ? statusA - statusB
            : statusB - statusA;
        }
        return 0;
      });
  };

  // Helper function to get status priority for sorting
  const getStatusPriority = (applicant: any): number => {
    if (
      !applicant.AI_summary &&
      !applicant.application?.supabase_application_id
    )
      return 0; // Not invited
    if (!applicant.AI_summary && applicant.application?.supabase_application_id)
      return 1; // In progress
    return 2; // Review ready
  };

  // Get unique job IDs and names for dropdown
  const jobOptions = useMemo(() => {
    const uniqueJobs = jobs.map((job) => ({
      id: job.id,
      name: job.name
    }));

    // Sort alphabetically
    return uniqueJobs.sort((a, b) => a.name.localeCompare(b.name));
  }, [jobs]);

  // Helper function to get columns based on active tab
  const getActiveColumns = () => {
    switch (activeTab) {
      case 'not-invited':
        return getNotInvitedColumns({
          handleViewApplicant: () => {},
          setSelectedApplicants: () => {}
        });
      case 'in-progress':
        return getInProgressColumns({
          handleViewApplicant: () => {},
          setSelectedApplicants: () => {}
        });
      case 'completed':
        return getCompletedColumns({
          handleViewApplicant: () => {},
          setSelectedApplicants: () => {}
        });
      default:
        return getNotInvitedColumns({
          handleViewApplicant: () => {},
          setSelectedApplicants: () => {}
        });
    }
  };

  // Export to Excel handler
  const handleExport = () => {
    const activeColumns = getActiveColumns();
    
    // Get the appropriate applicants array based on active tab
    let applicantsToExport;
    switch (activeTab) {
      case 'not-invited':
        applicantsToExport = notInvitedApplicants;
        break;
      case 'in-progress':
        applicantsToExport = inProgressApplicants;
        break;
      case 'completed':
        applicantsToExport = completedApplicants;
        break;
      default:
        applicantsToExport = notInvitedApplicants;
    }
    
    // Filter applicants with search if applicable
    const filteredApplicants = filterAndSortApplicants(applicantsToExport);
    
    // Extract column headers from column definitions (excluding action columns)
    const exportColumns = activeColumns
      .filter(col => {
        // Skip selection and action columns
        if ('id' in col) {
          return !['select', 'actions'].includes(col.id as string);
        }
        return true;
      })
      .map(col => {
        if ('header' in col && typeof col.header === 'string') {
          return col.header;
        }
        if ('accessorKey' in col) {
          return String(col.accessorKey).charAt(0).toUpperCase() + String(col.accessorKey).slice(1);
        }
        return '';
      })
      .filter(header => header !== '');
    
    // Map data for export based on visible columns
    const exportData = filteredApplicants.map(app => {
      const row: Record<string, any> = {};
      
      activeColumns.forEach(col => {
        if ('accessorKey' in col && col.accessorKey) {
          const key = col.accessorKey as string;
          const header = typeof col.header === 'string' ? col.header : key.charAt(0).toUpperCase() + key.slice(1);
          
          // Skip selection and action columns
          if (key === 'select' || key === 'actions' || key === 'accept') return;
          
          // Extract data based on accessorKey paths
          if (key.includes('.')) {
            const parts = key.split('.');
            let value = app;
            for (const part of parts) {
              value = value?.[part];
              if (value === undefined) break;
            }
            row[header] = value || '';
          } else if (key === 'fullName' && app.candidate) {
            row[header] = `${app.candidate.first_name || ''} ${app.candidate.last_name || ''}`;
          } else if (key === 'email' && app.candidate?.email_addresses?.[0]) {
            row[header] = app.candidate.email_addresses[0].value || '';
          } else if (key === 'name' && app.candidate) {
            row[header] = `${app.candidate.first_name || ''} ${app.candidate.last_name || ''}`;
          } else if (key === 'score') {
            // Normalize AI summary access to support both field name styles (ai_summary/AI_summary)
            const summary = app.ai_summary || app.AI_summary;
            
            if (!summary) {
              row[header] = '';
            } else if (Array.isArray(summary) && summary.length > 0) {
              // Sort by updated_at date (falling back to created_at) in descending order to get the most recent
              const sortedSummaries = [...summary].sort(
                (a, b) => 
                  new Date(b.updated_at || b.created_at).getTime() - 
                  new Date(a.updated_at || a.created_at).getTime()
              );
              
              const latestSummary = sortedSummaries[0];
              if (typeof latestSummary.overall_summary === 'string') {
                try {
                  const parsed = JSON.parse(latestSummary.overall_summary);
                  row[header] = parsed.score || '';
                } catch (e) {
                  row[header] = '';
                }
              } else {
                row[header] = latestSummary?.overall_summary?.score || '';
              }
            } else if (typeof summary.overall_summary === 'string') {
              try {
                const parsed = JSON.parse(summary.overall_summary);
                row[header] = parsed.score || '';
              } catch (e) {
                row[header] = '';
              }
            } else {
              row[header] = summary?.overall_summary?.score || '';
            }
          } else if (key === 'interviewDate') {
            // Normalize AI summary access to support both field name styles
            const summary = app.ai_summary || app.AI_summary;
            let completedDate = null;
            
            if (summary) {
              if (Array.isArray(summary) && summary.length > 0) {
                // Get the most recent summary by updated_at
                const sortedSummaries = [...summary].sort(
                  (a, b) =>
                    new Date(b.updated_at || b.updated_at).getTime() -
                    new Date(a.updated_at || a.updated_at).getTime()
                );
                completedDate = sortedSummaries[0].updated_at || sortedSummaries[0].created_at;
              } else {
                completedDate = summary.updated_at || summary.created_at;
              }
            }
            
            row[header] = completedDate ? new Date(completedDate).toLocaleDateString() : 'Unknown date';
          } else if (key.startsWith('resumeScore') || key.includes('Score')) {
            // Handle any score-related fields
            const summary = app.ai_summary || app.AI_summary;
            const scoreType = key;
            
            if (!summary) {
              row[header] = '';
            } else if (Array.isArray(summary) && summary.length > 0) {
              const sortedSummaries = [...summary].sort(
                (a, b) =>
                  new Date(b.updated_at || b.created_at).getTime() -
                  new Date(a.updated_at || a.created_at).getTime()
              );
              
              const latestSummary = sortedSummaries[0];
              row[header] = 
                latestSummary?.resume_analysis?.[scoreType] ||
                latestSummary?.overall_summary?.[scoreType] ||
                '';
            } else {
              row[header] = 
                summary?.resume_analysis?.[scoreType] ||
                summary?.overall_summary?.[scoreType] ||
                summary?.[scoreType] ||
                '';
            }
          } else if (key === 'status') {
            row[header] = app.application?.status || '';
          } else if (key === 'job') {
            row[header] = app.job?.name || '';
          } else {
            row[header] = app[key] || '';
          }
        } else if ('accessorFn' in col && typeof col.header === 'string') {
          // For columns with accessorFn, use header as key
          const header = col.header;
          // We can't use the accessorFn directly, so handle common fields
          if (header === 'Name') {
            row[header] = `${app.candidate?.first_name || ''} ${app.candidate?.last_name || ''}`;
          } else if (header === 'Email') {
            row[header] = app.candidate?.email_addresses?.[0]?.value || '';
          } else if (header === 'Job') {
            row[header] = app.job?.name || '';
          } else if (header === 'Status') {
            row[header] = app.application?.status || '';
          } else if (header === 'Overall Score' || header.includes('Score')) {
            // Handle any score-related headers
            const summary = app.ai_summary || app.AI_summary;
            if (!summary) {
              row[header] = '';
            } else if (Array.isArray(summary) && summary.length > 0) {
              const sortedSummaries = [...summary].sort(
                (a, b) =>
                  new Date(b.updated_at || b.created_at).getTime() -
                  new Date(a.updated_at || a.created_at).getTime()
              );
              
              if (header === 'Overall Score') {
                const latestSummary = sortedSummaries[0];
                if (typeof latestSummary.overall_summary === 'string') {
                  try {
                    const parsed = JSON.parse(latestSummary.overall_summary);
                    row[header] = parsed.score || '';
                  } catch (e) {
                    row[header] = '';
                  }
                } else {
                  row[header] = latestSummary?.overall_summary?.score || '';
                }
              } else {
                // Other score types (Resume Score, Technical Score, etc)
                const scoreType = header.replace(' Score', '').toLowerCase() + 'Score';
                row[header] = 
                  sortedSummaries[0]?.resume_analysis?.[scoreType] ||
                  sortedSummaries[0]?.overall_summary?.[scoreType] ||
                  '';
              }
            } else {
              // Single AI summary object
              if (header === 'Overall Score') {
                if (typeof summary.overall_summary === 'string') {
                  try {
                    const parsed = JSON.parse(summary.overall_summary);
                    row[header] = parsed.score || '';
                  } catch (e) {
                    row[header] = '';
                  }
                } else {
                  row[header] = summary?.overall_summary?.score || '';
                }
              } else {
                // Other score types
                const scoreType = header.replace(' Score', '').toLowerCase() + 'Score';
                row[header] = 
                  summary?.resume_analysis?.[scoreType] ||
                  summary?.overall_summary?.[scoreType] ||
                  summary?.[scoreType] ||
                  '';
              }
            }
          } else if (header === 'Completed On') {
            const summary = app.ai_summary || app.AI_summary;
            let completedDate = null;
            
            if (summary) {
              if (Array.isArray(summary) && summary.length > 0) {
                const sortedSummaries = [...summary].sort(
                  (a, b) =>
                    new Date(b.updated_at || b.created_at).getTime() -
                    new Date(a.updated_at || a.created_at).getTime()
                );
                completedDate = sortedSummaries[0].updated_at || sortedSummaries[0].created_at;
              } else {
                completedDate = summary.updated_at || summary.created_at;
              }
            }
            
            row[header] = completedDate ? new Date(completedDate).toLocaleDateString() : 'Unknown date';
          }
        }
      });
      
      return row;
    });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applicants');
    
    // Add headers
    if (exportData.length > 0) {
      const headers = Object.keys(exportData[0]);
      worksheet.addRow(headers);
      
      // Add data rows
      exportData.forEach(row => {
        const rowData = headers.map(header => row[header]);
        worksheet.addRow(rowData);
      });
    }
    
    // Generate buffer and save
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'applicants.xlsx');
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-14 flex items-center px-6 border-b shrink-0">
        <h1 className="text-lg font-semibold">Applicant Dashboard</h1>
      </header>
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="w-full max-w-[1200px] h-full flex flex-col">
              {/* Export Button */}
              <button
                onClick={handleExport}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors self-end"
              >
                Export to Excel
              </button>
              {/* Enhanced Job Filter Dropdown */}
              <Card className="mb-4 p-5 bg-white border border-blue-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center">
                    <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">
                      Job Position:
                    </span>
                  </div>

                  <div className="flex-1 max-w-xl">
                    <Select
                      value={selectedJobFilter}
                      onValueChange={setSelectedJobFilter}
                    >
                      <SelectTrigger className="w-full bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors text-blue-900">
                        <SelectValue placeholder="Select a job position" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {jobOptions.map((job) => (
                          <SelectItem
                            key={job.id}
                            value={job.id}
                            className="py-3 hover:bg-blue-50"
                          >
                            {job.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 border-blue-200 text-blue-800 font-medium py-1.5"
                    >
                      {
                        applicantCandidates.filter(
                          (app) => app.application?.supabase_application_id
                        ).length
                      }{' '}
                      applicants
                    </Badge>
                  </div>
                </div>

                {selectedJobFilter && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">
                          Not Invited:
                        </span>
                        <span className="text-sm">
                          {notInvitedApplicants.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm font-medium">
                          In Progress:
                        </span>
                        <span className="text-sm">
                          {inProgressApplicants.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Completed:</span>
                        <span className="text-sm">
                          {completedApplicants.length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <Tabs
                defaultValue="not-invited"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full h-full flex flex-col"
              >
                <div className="mb-4 border-b">
                  <TabsList className="bg-transparent w-full justify-start gap-2 h-12 p-0">
                    <TabsTrigger
                      value="not-invited"
                      className="flex items-center gap-2 px-6 py-3 rounded-t-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all hover:bg-blue-50 flex-1 justify-center"
                    >
                      <Send size={16} />
                      Not Invited
                      <Badge variant="outline" className="ml-1 bg-white">
                        {notInvitedApplicants.length}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="in-progress"
                      className="flex items-center gap-2 px-6 py-3 rounded-t-lg data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-amber-600 transition-all hover:bg-amber-50 flex-1 justify-center"
                    >
                      <Clock size={16} />
                      Interview In Progress
                      <Badge variant="outline" className="ml-1 bg-white">
                        {inProgressApplicants.length}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="completed"
                      className="flex items-center gap-2 px-6 py-3 rounded-t-lg data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 transition-all hover:bg-green-50 flex-1 justify-center"
                    >
                      <CheckCircle size={16} />
                      Interview Completed
                      <Badge variant="outline" className="ml-1 bg-white">
                        {completedApplicants.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden shadow-sm rounded-md">
                  <TabsContent
                    value="not-invited"
                    className="h-full m-0 border-t-4 border-blue-600 rounded-t-none bg-blue-50/30"
                  >
                    <InviteApplicantsTable
                      applicants={filterAndSortApplicants(notInvitedApplicants)}
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(
                            sortDirection === 'asc' ? 'desc' : 'asc'
                          );
                        } else {
                          setSortField(field);
                          setSortDirection('asc');
                        }
                      }}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      customColumns="not-invited"
                    />
                  </TabsContent>

                  <TabsContent
                    value="in-progress"
                    className="h-full m-0 border-t-4 border-amber-600 rounded-t-none bg-amber-50/30"
                  >
                    <InviteApplicantsTable
                      applicants={filterAndSortApplicants(inProgressApplicants)}
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(
                            sortDirection === 'asc' ? 'desc' : 'asc'
                          );
                        } else {
                          setSortField(field);
                          setSortDirection('asc');
                        }
                      }}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      customColumns="in-progress"
                    />
                  </TabsContent>

                  <TabsContent
                    value="completed"
                    className="h-full m-0 border-t-4 border-green-600 rounded-t-none bg-green-50/30"
                  >
                    <InviteApplicantsTable
                      applicants={filterAndSortApplicants(completedApplicants)}
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(
                            sortDirection === 'asc' ? 'desc' : 'asc'
                          );
                        } else {
                          setSortField(field);
                          setSortDirection('asc');
                        }
                      }}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      customColumns="completed"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
