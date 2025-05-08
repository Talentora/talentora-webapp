import { useReportsDashboard } from "../context/ReportsDashboardContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GraphComponent } from "../chart/Graph";

function SortableChartCard({ chart, openEditDialog, removeChart, duplicateChart, filteredData, onElementClick }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chart.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 relative bg-background">
      <div className="flex items-center gap-2 mb-4">
        <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" />
      </div>
      <GraphComponent 
        config={chart} 
        data={filteredData}
        onEdit={openEditDialog}
        onDuplicate={duplicateChart}
        onDelete={removeChart}
        onElementClick={onElementClick}
      />
    </Card>
  );
}

export default function DashboardCharts() {
  const {
    charts,
    setCharts,
    filteredData,
    openEditDialog,
    removeChart,
    duplicateChart,
    openNewChartDialog,
    handleChartElementClick,
    chartFilter,
    clearChartFilter,
  } = useReportsDashboard();

  // DnD handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCharts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      {/* Chart Filter Indicator */}
      {chartFilter && (
        <div className="mb-4 flex items-center ">
          <div className="bg-background p-2 rounded-md flex items-center gap-2">
            <span className="text-sm">
              Filtering by: <strong>{chartFilter.field.split('.').pop()}</strong> = <strong>{chartFilter.value}</strong>
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={clearChartFilter}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={charts.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-6">
            {charts.map((chart: any) => (
              <SortableChartCard 
                key={chart.id} 
                chart={chart}
                openEditDialog={openEditDialog}
                removeChart={removeChart}
                duplicateChart={duplicateChart}
                filteredData={filteredData}
                onElementClick={handleChartElementClick}
              />
            ))}
            <Card 
              className="p-4 flex items-center justify-center min-h-[300px] border-dashed cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={openNewChartDialog}
            >
              <Button variant="ghost" size="lg" className="w-full h-full flex flex-col gap-4">
                <PlusCircle className="h-12 w-12" />
                <span>Add New Graph</span>
              </Button>
            </Card>
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
} 