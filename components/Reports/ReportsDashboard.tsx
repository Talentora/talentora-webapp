"use client";

import { ReportsDashboardProvider } from "./context/ReportsDashboardContext";
import DashboardNavbar from "./dashboard/DashboardNavbar";
import DashboardCharts from "./dashboard/DashboardCharts";
import DashboardTable from "./dashboard/DashboardTable";
import DashboardEditDialog from "./dashboard/DashboardEditDialog";
import { type ApplicantData } from "@/components/Reports/data/fake-data";

export default function ReportsDashboard({ applicantData }: { applicantData: ApplicantData[] }) {
  return (
    <ReportsDashboardProvider applicantData={applicantData}>
      <div className="flex flex-col h-screen">
        <DashboardNavbar />
        <div className="flex-1 justify-between">
          <div className="flex flex-row gap-5">
            <DashboardTable />
            <DashboardCharts />
          </div>
        </div>
        <DashboardEditDialog />
      </div>
    </ReportsDashboardProvider>
  );
} 