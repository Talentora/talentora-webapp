import { EditChartDialog } from "./EditChartDialog";
import { useReportsDashboard } from "./ReportsDashboardContext";

export default function DashboardEditDialog() {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingChart,
    setEditingChart,
    saveChartChanges,
    isNewChart,
  } = useReportsDashboard();

  return (
    <EditChartDialog
      isOpen={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      editingChart={editingChart}
      setEditingChart={setEditingChart}
      onSave={saveChartChanges}
      isNewChart={isNewChart}
    />
  );
} 