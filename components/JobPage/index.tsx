"use client"

import { useState } from "react";
import { JobHeader } from "./JobHeader";
import { JobDetails } from "./JobDetails";
import ApplicantStatistics from "./ApplicantStatistics";
import { RecentApplicants } from "./RecentApplicants";
import { RoboRecruiterConfig } from "./BotConfig";

export default function JobPage({ job }) {
  const [visibleSections, setVisibleSections] = useState({
    jobDetails: true,
    applicantStats: true,
    recentApplicants: true,
    roboRecruiterConfig: true,
  });

  const toggleSection = (section) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <JobHeader job={job} toggleSection={toggleSection} visible={visibleSections.jobDetails} />
      {visibleSections.jobDetails && <JobDetails job={job} />}
      <ApplicantStatistics />
      <RecentApplicants toggleSection={toggleSection} visible={visibleSections.recentApplicants} />
      <RoboRecruiterConfig toggleSection={toggleSection} visible={visibleSections.roboRecruiterConfig} />
    </div>
  );
}
