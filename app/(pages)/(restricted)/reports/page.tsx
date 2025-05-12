"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, GripVertical, Loader2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraphComponent } from "./components/Graph";
import { Navbar } from "./components/Navbar";
import { EditChartDialog } from "./components/EditChartDialog";
import { initialCharts, type ChartConfig, type ApplicantData } from "./data/mock-data";
import { fetchAllApplications } from "@/server/applications";
import { ApplicantTable } from "./components/ApplicantTable";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const availableFields = [
  { value: "candidate.first_name", label: "First Name" },
  { value: "candidate.last_name", label: "Last Name" },
  { value: "candidate.email_addresses", label: "Email" },
  { value: "candidate.title", label: "Title" },
  { value: "job.name", label: "Job Name" },
  { value: "job.status", label: "Job Status" },
  { value: "application.current_stage", label: "Application Stage" },
  { value: "application.created_at", label: "Application Date" },
  { value: "interviewStages.name", label: "Stage Name" },
];

// Sortable chart card component
interface SortableChartCardProps {
  chart: ChartConfig;
  openEditDialog: (chart: ChartConfig) => void;
  removeChart: (chartId: string) => void;
  duplicateChart: (chart: ChartConfig) => void;
  filteredData: any[];
  onElementClick: (field: string, value: string) => void;
}

function SortableChartCard({ 
  chart, 
  openEditDialog, 
  removeChart, 
  duplicateChart, 
  filteredData,
  onElementClick
}: SortableChartCardProps) {
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
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="p-4 relative"
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
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

export default function GraphPlayground() {
  const [charts, setCharts] = useState<ChartConfig[]>(initialCharts);
  const [applicantData, setApplicantData] = useState<ApplicantData[]>([]);
  const [filteredData, setFilteredData] = useState<ApplicantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllApplications();
        console.log(data);
        setApplicantData(data);
        setFilteredData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching application data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const uniqueLocations = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.candidate && d.candidate.locations && d.candidate.locations.length > 0)
      .map(d => d.candidate?.locations?.[0]?.name || 'Unknown')
      .filter(Boolean) as string[])), 
    [applicantData]
  );
  
  const uniqueJobNames = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.job && d.job.name)
      .map(d => d.job?.name || 'Unknown'))), 
    [applicantData]
  );
  
  const uniqueStages = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.interviewStages && d.interviewStages.name)
      .map(d => d.interviewStages?.name || 'Unknown'))), 
    [applicantData]
  );
  
  const uniqueJobStatuses = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.job && d.job.status)
      .map(d => d.job?.status || 'Unknown'))), 
    [applicantData]
  );

  const [filters, setFilters] = useState({
    jobNames: [] as string[],
    stages: [] as string[],
    locations: [] as string[],
    jobStatuses: [] as string[],
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    },
    jobSearch: ""
  });
  
  useEffect(() => {
    if (!isLoading) {
      setFilters(prev => ({
        ...prev,
        locations: [...uniqueLocations],
        jobNames: [...uniqueJobNames],
        stages: [...uniqueStages],
        jobStatuses: [...uniqueJobStatuses]
      }));
    }
  }, [isLoading, uniqueLocations, uniqueJobNames, uniqueStages, uniqueJobStatuses]);
  
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewChart, setIsNewChart] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const applyFilters = useCallback(() => {
    let result = applicantData;
    
    if (filters.locations.length > 0) {
      result = result.filter(d => {
        if (!d.candidate?.locations || d.candidate.locations.length === 0) return false;
        return filters.locations.includes(d.candidate.locations[0]?.name || 'Unknown');
      });
    }
    
    if (filters.jobNames.length > 0) {
      result = result.filter(d => 
        filters.jobNames.includes(d.job?.name || 'Unknown')
      );
    }
    
    if (filters.stages.length > 0) {
      result = result.filter(d => 
        filters.stages.includes(d.interviewStages?.name || 'Unknown')
      );
    }
    
    if (filters.jobStatuses.length > 0) {
      result = result.filter(d => 
        filters.jobStatuses.includes(d.job?.status || 'Unknown')
      );
    }
    
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(d => {
        const appDate = d.application?.created_at ? new Date(d.application.created_at) : null;
        if (!appDate) return false;
        
        if (filters.dateRange.start && filters.dateRange.end) {
          return appDate >= filters.dateRange.start && appDate <= filters.dateRange.end;
        } else if (filters.dateRange.start) {
          return appDate >= filters.dateRange.start;
        } else if (filters.dateRange.end) {
          return appDate <= filters.dateRange.end;
        }
        
        return true;
      });
    }
    
    setFilteredData(result);
  }, [filters, applicantData]);

  const openEditDialog = (chart: ChartConfig) => {
    setIsNewChart(false);
    setEditingChart({...chart});
    setIsEditDialogOpen(true);
  };

  const openNewChartDialog = () => {
    setIsNewChart(true);
    setEditingChart({
      id: `chart${charts.length + 1}`,
      type: "line",
      title: "New Chart",
      rowFields: [],
      colFields: [],
      valueFields: [],
      aggregation: "count"
    });
    setIsEditDialogOpen(true);
  };

  const removeChart = (chartId: string) => {
    setCharts(charts.filter(c => c.id !== chartId));
  };

  const duplicateChart = (chartToDuplicate: ChartConfig) => {
    const newChart = {
      ...chartToDuplicate,
      id: `chart${charts.length + 1}`,
      title: `${chartToDuplicate.title} (Copy)`
    };
    setCharts([...charts, newChart]);
  };

  const saveChartChanges = () => {
    if (editingChart) {
      if (isNewChart) {
        setCharts([...charts, editingChart]);
      } else {
        setCharts(charts.map(c => 
          c.id === editingChart.id ? editingChart : c
        ));
      }
      setIsEditDialogOpen(false);
      setEditingChart(null);
      setIsNewChart(false);
    }
  };
  
  // Handle the drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCharts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const [chartFilter, setChartFilter] = useState<{ field: string; value: string } | null>(null);
  
  // Handle chart element click to filter the table
  const handleChartElementClick = (field: string, value: string) => {
    setChartFilter({ field, value });
  };
  
  // Clear the chart filter
  const clearChartFilter = () => {
    setChartFilter(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading application data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        uniqueLocations={uniqueLocations}
        uniqueJobNames={uniqueJobNames}
        uniqueStages={uniqueStages}
        uniqueJobStatuses={uniqueJobStatuses}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        filteredData={filteredData}
        mockData={applicantData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Chart Filter Indicator */}
        {chartFilter && (
          <div className="mb-4 flex items-center">
            <div className="bg-muted p-2 rounded-md flex items-center gap-2">
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={charts.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-6">
              {charts.map((chart) => (
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
        
        {/* Applicant Table */}
        <ApplicantTable data={filteredData} chartFilter={chartFilter} />
      </div>

      {/* Edit Chart Dialog */}
      <EditChartDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingChart={editingChart}
        setEditingChart={setEditingChart}
        onSave={saveChartChanges}
        isNewChart={isNewChart}
      />
    </div>
  );
}