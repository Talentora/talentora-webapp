'use client';

import { useState, useEffect, useMemo } from 'react';
import InviteApplicantsTable from '@/components/Applicants/InviteApplicantsTable';
import { Loader2, Send, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { fetchJobsData } from '@/server/jobs';
import { fetchAllApplications } from '@/server/applications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card
} from "@/components/ui/card";

export default function ApplicantList() {
  const [applicantCandidates, setApplicantCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<string>("not-invited");
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both joined applicants and jobs data
        const [applicantsData, jobsData] = await Promise.all([
          await fetchAllApplications(),
          await fetchJobsData()
        ]);
        
        if (!Array.isArray(applicantsData)) {
          console.error('Applicants data is not an array:', applicantsData);
          return;
        }
        
        setApplicantCandidates(applicantsData);
        setJobs(jobsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter applicants based on selected job
  const filteredByJobApplicants = useMemo(() => {
    if (selectedJobFilter === "all") return applicantCandidates;
    
    return applicantCandidates.filter(app => 
      app.job?.id === selectedJobFilter
    );
  }, [applicantCandidates, selectedJobFilter]);

  // Filter applicants based on status after job filter
  const notInvitedApplicants = filteredByJobApplicants.filter(app => 
    !app.application?.supabase_application_id && !app.ai_summary
  );

  const inProgressApplicants = filteredByJobApplicants.filter(app => 
    app.application?.supabase_application_id && (!app.ai_summary || 
    (Array.isArray(app.ai_summary) && app.ai_summary.length === 0))
  );

  const completedApplicants = filteredByJobApplicants.filter(app => 
    app.ai_summary && 
    !(Array.isArray(app.ai_summary) && app.ai_summary.length === 0)
  );

  // Filter based on search term and apply sorting
  const filterAndSortApplicants = (applicants: any[]) => {
    return applicants
      .filter((app: any) => {
        if (!searchTerm) return true;
        if (!app.candidate) return false;
        
        const fullName = `${app.candidate.first_name} ${app.candidate.last_name}`.toLowerCase();
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
    if (!applicant.AI_summary && !applicant.applicant) return 0; // Not invited
    if (!applicant.AI_summary && applicant.applicant) return 1;  // In progress
    return 2; // Review ready
  };

  // Get unique job IDs and names for dropdown
  const jobOptions = useMemo(() => {
    const uniqueJobs = jobs.map(job => ({
      id: job.id,
      name: job.name
    }));
    
    // Sort alphabetically
    return uniqueJobs.sort((a, b) => a.name.localeCompare(b.name));
  }, [jobs]);

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
              {/* Job Filter Dropdown */}
              <Card className="mb-4 p-4 flex items-center gap-4 bg-white">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">Filter by Job:</span>
                </div>
                <Select
                  value={selectedJobFilter}
                  onValueChange={setSelectedJobFilter}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobOptions.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedJobFilter !== "all" && (
                  <Badge variant="outline" className="ml-auto">
                    {filteredByJobApplicants.length} applicants
                  </Badge>
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
                  <TabsContent value="not-invited" className="h-full m-0 border-t-4 border-blue-600 rounded-t-none bg-blue-50/30">
                    <InviteApplicantsTable 
                      applicants={filterAndSortApplicants(notInvitedApplicants)} 
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
                  
                  <TabsContent value="in-progress" className="h-full m-0 border-t-4 border-amber-600 rounded-t-none bg-amber-50/30">
                    <InviteApplicantsTable 
                      applicants={filterAndSortApplicants(inProgressApplicants)} 
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
                  
                  <TabsContent value="completed" className="h-full m-0 border-t-4 border-green-600 rounded-t-none bg-green-50/30">
                    <InviteApplicantsTable 
                      applicants={filterAndSortApplicants(completedApplicants)} 
                      jobs={jobs}
                      onSort={(field) => {
                        if (sortField === field) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
