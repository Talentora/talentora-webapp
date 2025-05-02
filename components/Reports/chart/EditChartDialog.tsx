"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChartConfig, ApplicantData } from "@/components/Reports/data/mock-data";
import { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  useDroppable
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BarChart2,Grip, LineChart as LineChartIcon, PieChart, Hash, Type } from "lucide-react";

// Import chart preview components
import {BarChartComponent} from "./graphs/BarChart";
import {PieChartComponent} from "./graphs/PieChart";
import {LineChartComponent} from "./graphs/LineChart";
import { ScatterChartComponent } from "./graphs/ScatterChart";
const availableFields = [
  { value: "candidate.first_name", label: "First Name", type: "text" },
  { value: "candidate.last_name", label: "Last Name", type: "text" },
  { value: "candidate.email_addresses", label: "Email", type: "text" },
  { value: "candidate.title", label: "Title", type: "text" },
  { value: "job.name", label: "Job Name", type: "text" },
  { value: "job.status", label: "Job Status", type: "text" },
  { value: "application.current_stage", label: "Application Stage", type: "text" },
  { value: "application.created_at", label: "Application Date", type: "text" },
  { value: "interviewStages.name", label: "Stage Name", type: "text" },
  { value: "application.count", label: "Application Count", type: "number" },
  { value: "candidate.age", label: "Age", type: "number" },
  { value: "job.salary", label: "Salary", type: "number" },
  // AI_Summary scores
  { value: "AI_Summary.text_eval.technical.overall_score", label: "Tech Score", type: "number" },
  { value: "AI_Summary.text_eval.behavioral.overall_score", label: "Behavioral Score", type: "number" },
  { value: "AI_Summary.text_eval.experience.overall_score", label: "Experience Score", type: "number" },
  { value: "AI_Summary.text_eval.communication.overall_score", label: "Communication Score", type: "number" },
  { value: "AI_Summary.emotion_eval.overall_score", label: "Emotion Score", type: "number" },
  { value: "AI_Summary.resume_analysis.resumeScore", label: "Resume Score", type: "number" },
  { value: "AI_Summary.resume_analysis.technicalScore", label: "Resume Tech", type: "number" },
  { value: "AI_Summary.resume_analysis.cultureFitScore", label: "Culture Fit", type: "number" },
  { value: "AI_Summary.resume_analysis.communicationScore", label: "Resume Comm", type: "number" },
];

interface EditChartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingChart: ChartConfig | null;
  setEditingChart: (chart: ChartConfig | null) => void;
  onSave: () => void;
  isNewChart: boolean;
}

interface DraggableFieldProps {
  field: { value: string; label: string; type: string };
  id: string;
}

const DraggableField = ({ field, id }: DraggableFieldProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? 'relative' as const : undefined,
    backgroundColor: isDragging ? 'white' : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-white border rounded-md shadow-sm mb-2 cursor-move hover:bg-gray-50 flex items-center justify-between"
    >
      <span>{field.label}</span>
      {field.type === "number" ? (
        <Hash className="h-3 w-3 text-gray-500" />
      ) : (
        <Type className="h-3 w-3 text-gray-500" />
      )}
    </div>
  );
};

const DroppedField = ({ 
  field, 
  onRemove 
}: { 
  field: { value: string; label: string; type: string }; 
  onRemove: () => void;
}) => {
  return (
    <div className="p-2 bg-white border rounded-md flex items-center justify-between group">
      <span>{field.label}</span>
      <div className="flex items-center gap-2">
        {field.type === "number" ? (
          <Hash className="h-3 w-3 text-gray-500" />
        ) : (
          <Type className="h-3 w-3 text-gray-500" />
        )}
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 p-1 -m-1"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const DropZone = ({ 
  title, 
  fields, 
  onDrop, 
  onRemove,
  id 
}: { 
  title: string; 
  fields: string[]; 
  onDrop: (items: string[]) => void; 
  onRemove: (field: string) => void;
  id: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  return (
    <div 
      ref={setNodeRef}
      className={`border rounded-md p-4 min-h-[100px] transition-colors ${
        isOver ? 'bg-gray-100 border-gray-400' : 'bg-gray-50'
      }`}
    >
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="space-y-2">
        {fields.map((fieldValue) => {
          const field = availableFields.find(f => f.value === fieldValue);
          return field ? (
            <DroppedField 
              key={field.value} 
              field={field}
              onRemove={() => onRemove(field.value)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export function EditChartDialog({
  isOpen,
  onOpenChange,
  editingChart,
  setEditingChart,
  onSave,
  isNewChart,
}: EditChartDialogProps) {
  const [previewData] = useState<ApplicantData[]>([
    {
      candidate: {
        id: "c1",
        first_name: "John",
        last_name: "Doe",
        title: "Developer",
        email_addresses: [{ email: "john@example.com" }],
        locations: [{ name: "New York" }],
        created_at: "2024-01-01",
        modified_at: "2024-01-01"
      },
      job: {
        id: "j1",
        name: "Frontend Dev",
        status: "Open",
        description: "Frontend Developer position",
        code: "FE-001"
      },
      application: {
        id: "a1",
        job_id: "j1",
        created_at: "2024-01-01",
        current_stage: "Interview"
      },
      interviewStages: {
        id: "s1",
        name: "Technical",
        job: "j1",
        stage_order: 1
      },
      AI_Summary: {
        text_eval: {
          technical: { overall_score: 80 },
          behavioral: { overall_score: 70 },
          experience: { overall_score: 75 },
          communication: { overall_score: 85 },
        },
        emotion_eval: { overall_score: 90 },
        resume_analysis: {
          resumeScore: 88,
          technicalScore: 80,
          cultureFitScore: 85,
          communicationScore: 82,
        },
      },
      hasSupabaseData: true,
      hasMergeData: true,
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && editingChart) {
      const fieldValue = active.id as string;
      const dropZoneId = over.id as string;
      
      // Check if the field is already in any of the zones
      const allFields = [
        ...editingChart.rowFields,
        ...editingChart.colFields,
        ...editingChart.valueFields.map(vf => vf.field)
      ];
      
      if (allFields.includes(fieldValue)) {
        return; // Field is already used
      }
      
      if (dropZoneId === "rows") {
        setEditingChart({
          ...editingChart,
          rowFields: [...editingChart.rowFields, fieldValue]
        });
      } else if (dropZoneId === "columns") {
        setEditingChart({
          ...editingChart,
          colFields: [...editingChart.colFields, fieldValue]
        });
      } else if (dropZoneId === "values") {
        setEditingChart({
          ...editingChart,
          valueFields: [...editingChart.valueFields, { field: fieldValue, aggregation: "count" }]
        });
      }
    }
  };

  const handleRemoveField = (field: string, zone: 'rows' | 'columns' | 'values') => {
    if (!editingChart) return;

    const updatedChart = { ...editingChart };
    if (zone === 'rows') {
      updatedChart.rowFields = updatedChart.rowFields.filter(f => f !== field);
    } else if (zone === 'columns') {
      updatedChart.colFields = updatedChart.colFields.filter(f => f !== field);
    } else if (zone === 'values') {
      updatedChart.valueFields = updatedChart.valueFields.filter(vf => vf.field !== field);
    }
    setEditingChart(updatedChart);
  };

  // Get list of available (unused) fields
  const usedFields = editingChart ? [
    ...editingChart.rowFields,
    ...editingChart.colFields,
    ...editingChart.valueFields.map(vf => vf.field)
  ] : [];
  
  const availableFieldsList = availableFields.filter(
    field => !usedFields.includes(field.value)
  );

  if (!editingChart) return null;

  // Chart preview switcher
  function ChartPreview({ config, data }: { config: ChartConfig, data: ApplicantData[] }) {
    if (config.type === "bar") {
      return <BarChartComponent config={config} data={data} />;
    }
    if (config.type === "pie") {
      return <PieChartComponent config={config} data={data} />;
    }
    if (config.type === "line") {
      return <LineChartComponent config={config} data={data} />;
    }
    if (config.type === "scatter") {
        return <ScatterChartComponent config={config} data={data} />;
      }
    // fallback
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a supported chart type to preview.
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl z-[100]">
        <DialogHeader>
          <DialogTitle>{isNewChart ? "Create New Chart" : "Edit Chart"}</DialogTitle>
        </DialogHeader>
        
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-[250px_1fr] gap-4">
            {/* Left sidebar - Available Fields */}
            <div className="border-r pr-4">
              <div className="mb-3">
                <Label htmlFor="title">Chart Title</Label>
                <Input
                  id="title"
                  value={editingChart.title}
                  onChange={(e) =>
                    setEditingChart({ ...editingChart, title: e.target.value })
                  }
                />
              </div>
              
              <div className="mb-3">
                <Label htmlFor="type">Chart Type</Label>
                <Select
                  value={editingChart.type}
                  onValueChange={(value) =>
                    setEditingChart({ ...editingChart, type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[110]">
                    <SelectItem value="bar">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4" />
                        <span>Bar Chart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="line">
                      <div className="flex items-center gap-2">
                        <LineChartIcon className="h-4 w-4" />
                        <span>Line Chart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        <span>Pie Chart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="scatter">
                      <div className="flex items-center gap-2">
                        <Grip className="h-4 w-4" />
                        <span>Scatter Chart</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Available Fields</Label>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 mb-2">
                  <div className="flex items-center gap-1">
                    <Type className="h-3 w-3" /> Text
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Numeric
                  </div>
                </div>
                <div className="space-y-1 mt-1 h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  {availableFieldsList.map((field) => (
                    <DraggableField key={field.value} field={field} id={field.value} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Drop zones and Preview */}
            <div className="space-y-4">
              {/* Drop Zones */}
              <div className="grid grid-cols-3 gap-3">
                <DropZone 
                  id="rows"
                  title="Rows" 
                  fields={editingChart.rowFields}
                  onDrop={(items) => setEditingChart({ ...editingChart, rowFields: items })}
                  onRemove={(field) => handleRemoveField(field, 'rows')}
                />
                <DropZone 
                  id="columns"
                  title="Columns" 
                  fields={editingChart.colFields}
                  onDrop={(items) => setEditingChart({ ...editingChart, colFields: items })}
                  onRemove={(field) => handleRemoveField(field, 'columns')}
                />
                <DropZone 
                  id="values"
                  title="Values"
                  fields={editingChart.valueFields.map(vf => vf.field)}
                  onDrop={(items) => setEditingChart({
                    ...editingChart,
                    valueFields: items.map(field =>
                      editingChart.valueFields.find(vf => vf.field === field) || { field, aggregation: "count" }
                    )
                  })}
                  onRemove={(field) => setEditingChart({
                    ...editingChart,
                    valueFields: editingChart.valueFields.filter(vf => vf.field !== field)
                  })}
                />
              </div>

              {editingChart.valueFields.map((vf, idx) => (
                <div key={vf.field} className="flex items-center gap-2 mt-1">
                  <span>{availableFields.find(f => f.value === vf.field)?.label}</span>
                  <Select
                    value={vf.aggregation}
                    onValueChange={agg =>
                      setEditingChart({
                        ...editingChart,
                        valueFields: editingChart.valueFields.map((v, i) =>
                          i === idx ? { ...v, aggregation: agg as any } : v
                        )
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="count">Count</SelectItem>
                      <SelectItem value="sum">Sum</SelectItem>
                      <SelectItem value="avg">Average</SelectItem>
                      <SelectItem value="min">Min</SelectItem>
                      <SelectItem value="max">Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Chart Preview */}
              <div className="border rounded-lg p-3 bg-white">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="h-[250px]">
                  <ChartPreview config={editingChart} data={previewData} />
                </div>
              </div>
            </div>
          </div>
        </DndContext>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isNewChart ? "Create Chart" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 