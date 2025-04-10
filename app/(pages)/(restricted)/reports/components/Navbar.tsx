import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { ApplicantData } from "../data/mock-data";
import { useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NavbarProps {
  uniqueLocations: string[];
  uniqueSkills: string[];
  uniqueEducation: string[];
  filters: {
    locations: string[];
    skills: string[];
    education: string[];
    minExperience: number;
    maxExperience: number;
    jobs: string[];
    jobSearch: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    locations: string[];
    skills: string[];
    education: string[];
    minExperience: number;
    maxExperience: number;
    jobs: string[];
    jobSearch: string;
  }>>;
  applyFilters: () => void;
  filteredData: ApplicantData[];
  mockData: ApplicantData[];
}

export const Navbar = ({
  uniqueLocations,
  uniqueSkills,
  uniqueEducation,
  filters,
  setFilters,
  applyFilters,
  filteredData,
  mockData
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract unique jobs from mock data
  const uniqueJobs = useMemo(() => 
    Array.from(new Set(mockData.map(d => d.job))), 
    [mockData]
  );
  
  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!filters.jobSearch) return uniqueJobs;
    return uniqueJobs.filter(job => 
      job.toLowerCase().includes(filters.jobSearch.toLowerCase())
    );
  }, [uniqueJobs, filters.jobSearch]);

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  return (
    <div className="w-full border-b bg-background sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Applicant Reports</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredData.length} of {mockData.length} applicants
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
                            jobs: values
                          }));
                        }}
                        value={filters.jobs.filter(job => filteredJobs.includes(job))}
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
                      <h4 className="text-sm font-medium">Education</h4>
                      <MultiSelect
                        options={uniqueEducation.map(edu => ({
                          label: edu,
                          value: edu
                        }))}
                        onValueChange={(values) => {
                          setFilters(prev => ({
                            ...prev,
                            education: values
                          }));
                        }}
                        value={filters.education}
                        placeholder="Select education"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Skills</h4>
                    <MultiSelect
                      options={uniqueSkills.map(skill => ({
                        label: skill,
                        value: skill
                      }))}
                      onValueChange={(values) => {
                        setFilters(prev => ({
                          ...prev,
                          skills: values
                        }));
                      }}
                      value={filters.skills}
                      placeholder="Select skills"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Experience Range</h4>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">{filters.minExperience} years</span>
                        <span className="text-xs">{filters.maxExperience} years</span>
                      </div>
                      <Slider
                        defaultValue={[filters.minExperience, filters.maxExperience]}
                        min={0}
                        max={15}
                        step={1}
                        onValueChange={([min, max]) => 
                          setFilters(prev => ({
                            ...prev,
                            minExperience: min,
                            maxExperience: max
                          }))
                        }
                        className="w-full"
                      />
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
}; 