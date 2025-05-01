"use client";
import { ReportsDashboardProvider } from "../context/ReportsDashboardContext";
import DashboardNavbar from "./DashboardNavbar";
import DashboardCharts from "./DashboardCharts";
import DashboardTable from "../dashboard/DashboardTable";
import DashboardEditDialog from "./DashboardEditDialog";
import { type ApplicantData } from "../data/mock-data";

export default function ReportsDashboard({ applicantData }: { applicantData: ApplicantData[] }) {
  return (
    <ReportsDashboardProvider applicantData={applicantData}>
      <div className="flex flex-col h-screen">
        <DashboardNavbar />
        <div className="flex-1 p-6 overflow-auto ">
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