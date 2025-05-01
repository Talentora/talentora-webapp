import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { useReportsDashboard } from "./ReportsDashboardContext";

export default function DashboardNavbar() {
  const {
    filters,
    setFilters,
    applyFilters,
    filteredData,
    applicantData,
  } = useReportsDashboard();

  const [isOpen, setIsOpen] = useState(false);

  // Compute unique values for Navbar
  const uniqueLocations = useMemo(() => Array.from(new Set(applicantData
    .filter(d => d.candidate && d.candidate.locations && d.candidate.locations.length > 0)
    .map(d => d.candidate?.locations?.[0]?.name || 'Unknown')
    .filter(Boolean) as string[])), [applicantData]);
  const uniqueJobNames = useMemo(() => Array.from(new Set(applicantData
    .filter(d => d.job && d.job.name)
    .map(d => d.job?.name || 'Unknown'))), [applicantData]);
  const uniqueStages = useMemo(() => Array.from(new Set(applicantData
    .filter(d => d.interviewStages && d.interviewStages.name)
    .map(d => d.interviewStages?.name || 'Unknown'))), [applicantData]);
  const uniqueJobStatuses = useMemo(() => Array.from(new Set(applicantData
    .filter(d => d.job && d.job.status)
    .map(d => d.job?.status || 'Unknown'))), [applicantData]);

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!filters.jobSearch) return uniqueJobNames;
    return uniqueJobNames.filter(job => 
      job.toLowerCase().includes(filters.jobSearch.toLowerCase())
    );
  }, [uniqueJobNames, filters.jobSearch]);

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  return (
    <div className="w-full sticky top-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Applicant Reports</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredData.length} of {applicantData.length} applicants
            </div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4" align="end">
                <div className="space-y-4">
                  {/* Job Filter Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Job Title</h4>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search job titles..."
                          className="pl-8"
                          value={filters.jobSearch}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              jobSearch: e.target.value
                            }));
                          }}
                        />
                      </div>
                      <MultiSelect
                        options={filteredJobs.map(job => ({
                          label: job,
                          value: job
                        }))}
                        onValueChange={(values) => {
                          setFilters(prev => ({
                            ...prev,
                            jobNames: values
                          }));
                        }}
                        value={filters.jobNames.filter(job => filteredJobs.includes(job))}
                        placeholder="Select job titles"
                        className="max-h-40 overflow-y-auto"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Location</h4>
                      <MultiSelect
                        options={uniqueLocations.map(location => ({
                          label: location,
                          value: location
                        }))}
                        onValueChange={(values) => {
                          setFilters(prev => ({
                            ...prev,
                            locations: values
                          }));
                        }}
                        value={filters.locations}
                        placeholder="Select locations"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Job Status</h4>
                      <MultiSelect
                        options={uniqueJobStatuses.map(status => ({
                          label: status,
                          value: status
                        }))}
                        onValueChange={(values) => {
                          setFilters(prev => ({
                            ...prev,
                            jobStatuses: values
                          }));
                        }}
                        value={filters.jobStatuses}
                        placeholder="Select job status"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Application Stage</h4>
                    <MultiSelect
                      options={uniqueStages.map(stage => ({
                        label: stage,
                        value: stage
                      }))}
                      onValueChange={(values) => {
                        setFilters(prev => ({
                          ...prev,
                          stages: values
                        }));
                      }}
                      value={filters.stages}
                      placeholder="Select application stages"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Application Date Range</h4>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="w-1/2">
                          <Label>From</Label>
                          <Input
                            type="date"
                            value={filters.dateRange.start ? filters.dateRange.start.toISOString().substring(0, 10) : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              setFilters(prev => ({
                                ...prev,
                                dateRange: {
                                  ...prev.dateRange,
                                  start: date
                                }
                              }));
                            }}
                          />
                        </div>
                        <div className="w-1/2">
                          <Label>To</Label>
                          <Input
                            type="date"
                            value={filters.dateRange.end ? filters.dateRange.end.toISOString().substring(0, 10) : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              setFilters(prev => ({
                                ...prev,
                                dateRange: {
                                  ...prev.dateRange,
                                  end: date
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
} 