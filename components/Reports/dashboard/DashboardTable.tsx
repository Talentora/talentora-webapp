import { ApplicantTable } from "../table/ApplicantTable";
import { useReportsDashboard } from "../context//ReportsDashboardContext";

export default function DashboardTable() {
  const { filteredData, chartFilter } = useReportsDashboard();
  return <ApplicantTable data={filteredData} chartFilter={chartFilter} />;
} 