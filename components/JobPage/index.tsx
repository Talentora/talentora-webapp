import { useState } from "react";
import { JobHeader } from "./JobHeader";
import { JobDetails } from "./JobDetails";
import ApplicantStatistics from "./ApplicantStatistics";
import { RecentApplicants } from "./RecentApplicants";
import { RoboRecruiterConfig } from "./BotConfig";
import { Tables } from "@/types/types_db";

type Job = Tables<'jobs'>;

interface JobPageProps {
  job: Job;
}

/**
 * Represents a section in the JobPage component.
 */
interface Section {
  key: string;
  Component: React.ComponentType<any>;
  props: Record<string, any>;
}

/**
 * JobPage component displays detailed information about a job posting.
 * It includes various sections that can be toggled on/off by the user.
 * 
 * @param {JobPageProps} props - The props for the JobPage component.
 * @returns {JSX.Element} The rendered JobPage component.
 */
export default function JobPage({ job }: JobPageProps) {
  // State to keep track of which sections are visible
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(['jobDetails', 'applicantStats', 'recentApplicants', 'roboRecruiterConfig'])
  );

  /**
   * Toggles the visibility of a section.
   * 
   * @param {string} sectionKey - The key of the section to toggle.
   */
  const toggleSection = (sectionKey: string) => {
    setVisibleSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  // Define the sections of the job page
  const sections: Section[] = [
    { key: 'jobDetails', Component: JobDetails, props: { job } },
    { key: 'applicantStats', Component: ApplicantStatistics, props: {} },
    { key: 'recentApplicants', Component: RecentApplicants, props: { jobId: job.id } },
    { key: 'roboRecruiterConfig', Component: RoboRecruiterConfig, props: {} },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Job Header is always rendered, but can be toggled */}
      <JobHeader 
        job={job} 
        toggleSection={() => toggleSection('jobDetails')} 
        visible={visibleSections.has('jobDetails')} 
      />
      
      {/* Render each section based on its visibility state */}
      {sections.map(({ key, Component, props }) => 
        visibleSections.has(key) && (
          <Component 
            key={key} 
            {...props} 
            toggleSection={() => toggleSection(key)} 
            visible={true} 
          />
        )
      )}
    </div>
  );
}
