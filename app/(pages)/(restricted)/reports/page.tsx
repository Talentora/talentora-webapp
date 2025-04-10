"use client";

import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraphComponent } from "./components/Graph";
import { Navbar } from "./components/Navbar";
import { EditChartDialog } from "./components/EditChartDialog";
import { generateMockData, initialCharts, type ChartConfig } from "./data/mock-data";
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
  { value: "experience", label: "Experience" },
  { value: "age", label: "Age" },
  { value: "education", label: "Education" },
  { value: "location", label: "Location" },
  { value: "skills", label: "Skills" },
];

// Sortable chart card component
interface SortableChartCardProps {
  chart: ChartConfig;
  openEditDialog: (chart: ChartConfig) => void;
  removeChart: (chartId: string) => void;
  duplicateChart: (chart: ChartConfig) => void;
  filteredData: any[];
}

function SortableChartCard({ chart, openEditDialog, removeChart, duplicateChart, filteredData }: SortableChartCardProps) {
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
      />
    </Card>
  );
}

export default function GraphPlayground() {
  const [charts, setCharts] = useState<ChartConfig[]>(initialCharts);
  const [mockData] = useState(() => generateMockData(30));
  const [filteredData, setFilteredData] = useState(mockData);
  
  const uniqueLocations = useMemo(() => 
    Array.from(new Set(mockData.map(d => d.location))), 
    [mockData]
  );
  
  const uniqueSkills = useMemo(() => 
    Array.from(new Set(mockData.flatMap(d => d.skills))), 
    [mockData]
  );
  
  const uniqueEducation = useMemo(() => 
    Array.from(new Set(mockData.map(d => d.education))), 
    [mockData]
  );
  
  const uniqueJobs = useMemo(() => 
    Array.from(new Set(mockData.map(d => d.job))), 
    [mockData]
  );

  const [filters, setFilters] = useState({
    locations: [...uniqueLocations],
    skills: [...uniqueSkills],
    education: [...uniqueEducation],
    minExperience: 0,
    maxExperience: 15,
    jobs: [...uniqueJobs],
    jobSearch: ""
  });
  
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
    let result = mockData;
    
    if (filters.locations.length > 0) {
      result = result.filter(d => filters.locations.includes(d.location));
    }
    
    if (filters.skills.length > 0) {
      result = result.filter(d => 
        d.skills.some(skill => filters.skills.includes(skill))
      );
    }
    
    if (filters.education.length > 0) {
      result = result.filter(d => filters.education.includes(d.education));
    }
    
    if (filters.jobs.length > 0) {
      result = result.filter(d => filters.jobs.includes(d.job));
    }
    
    result = result.filter(d => 
      d.experience >= filters.minExperience && 
      d.experience <= filters.maxExperience
    );
    
    setFilteredData(result);
  }, [filters, mockData]);

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
      xAxis: {
        type: "value",
        label: "Experience"
      },
      yAxis: {
        type: "value",
        label: "Count"
      }
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

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        uniqueLocations={uniqueLocations}
        uniqueSkills={uniqueSkills}
        uniqueEducation={uniqueEducation}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        filteredData={filteredData}
        mockData={mockData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
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