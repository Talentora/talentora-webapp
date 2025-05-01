import { ApplicantTable } from "./ApplicantTable";
import { useReportsDashboard } from "./ReportsDashboardContext";

export default function DashboardTable() {
  const { filteredData, chartFilter } = useReportsDashboard();
  return <ApplicantTable data={filteredData} chartFilter={chartFilter} />;
} 