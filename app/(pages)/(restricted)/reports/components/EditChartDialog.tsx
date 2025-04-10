import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartType } from "../data/mock-data";
import { useState, useEffect, useRef } from "react";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";

// Field type definitions
type FieldType = "string" | "number";

interface Field {
  name: string;
  type: FieldType;
  label: string;
}

// Field areas
type FieldArea = "available" | "rows" | "columns" | "values";

// Draggable field item
interface DraggableFieldProps {
  field: Field;
  id: string;
  area: FieldArea;
  onRemove?: () => void;
}

const FIELD_DEFINITIONS: Field[] = [
  { name: "experience", type: "number", label: "Experience 🔢" },
  { name: "age", type: "number", label: "Age 🔢" },
  { name: "education", type: "string", label: "Education 📝" },
  { name: "location", type: "string", label: "Location 📝" },
  { name: "skills", type: "string", label: "Skills 📝" },
  { name: "job", type: "string", label: "Job Title 📝" }
];

const NUMERIC_OPERATIONS = [
  { value: "count", label: "Count (#)" },
  { value: "sum", label: "Sum (Σ)" },
  { value: "average", label: "Average (μ)" },
  { value: "min", label: "Minimum (↓)" },
  { value: "max", label: "Maximum (↑)" }
];

// Draggable Field Component
function DraggableField({ field, id, area, onRemove }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { field, fromArea: area },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-3 py-2 bg-white border rounded-md shadow-sm"
      {...attributes}
      {...listeners}
    >
      <div className="flex-grow">
        {field.label}
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// Droppable Area Component
function DroppableArea({ 
  id, 
  label, 
  fields, 
  accept = ["available", "rows", "columns", "values"],
  onRemove
}: { 
  id: FieldArea; 
  label: string; 
  fields: Field[];
  accept?: FieldArea[];
  onRemove: (index: number) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { accepts: accept },
  });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        ref={setNodeRef}
        className={`p-3 min-h-[100px] border rounded-md ${
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-200"
        } flex flex-col gap-2`}
      >
        {fields.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Drop fields here
          </div>
        )}
        {fields.map((field, index) => (
          <DraggableField
            key={`${id}-${field.name}-${index}`}
            id={`${id}-${field.name}-${index}`}
            field={field}
            area={id}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}

interface EditChartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingChart: ChartConfig | null;
  setEditingChart: (chart: ChartConfig | null) => void;
  onSave: () => void;
  isNewChart: boolean;
}

export function EditChartDialog({
  isOpen,
  onOpenChange,
  editingChart,
  setEditingChart,
  onSave,
  isNewChart,
}: EditChartDialogProps) {
  // Track initialization to avoid infinite loops
  const isInitializedRef = useRef(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // delay before touch drag starts
        tolerance: 5, // tolerance for movement
      },
    })
  );

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: "line", label: "Line 📈" },
    { value: "bar", label: "Bar 📊" },
    { value: "scatter", label: "Scatter 📍" },
    { value: "pie", label: "Pie 🥧" },
    { value: "area", label: "Area 📉" },
  ];

  // Fields for different areas
  const [rowFields, setRowFields] = useState<Field[]>([]);
  const [columnFields, setColumnFields] = useState<Field[]>([]);
  const [valueFields, setValueFields] = useState<Field[]>([]);
  
  // Track field changes to avoid excessive updates
  const fieldsUpdateRequiredRef = useRef(false);

  // Reset initialization when dialog opens or chart changes
  useEffect(() => {
    if (isOpen) {
      isInitializedRef.current = false;
    }
  }, [isOpen, editingChart]);

  // Initialize fields based on the current editingChart
  useEffect(() => {
    if (editingChart && !isInitializedRef.current) {
      isInitializedRef.current = true;

      // Initialize row field (x-axis)
      const xField = FIELD_DEFINITIONS.find(
        f => f.name === editingChart.xAxis.label.toLowerCase()
      );
      setRowFields(xField ? [xField] : []);

      // Initialize value field (y-axis)
      const yField = FIELD_DEFINITIONS.find(
        f => f.name === editingChart.yAxis?.label.toLowerCase()
      );
      if (yField) {
        const isOperation = NUMERIC_OPERATIONS.some(
          op => op.value === editingChart.yAxis?.label.toLowerCase()
        );
        if (!isOperation) {
          setValueFields(yField ? [yField] : []);
        } else {
          // If it's an operation, use a numeric field
          const numericField = FIELD_DEFINITIONS.find(f => f.type === "number");
          setValueFields(numericField ? [numericField] : []);
        }
      } else {
        setValueFields([]);
      }

      // Initialize column field
      const columnFieldName = typeof editingChart.columnField === 'string' ? editingChart.columnField : '';
      if (columnFieldName) {
        const columnField = FIELD_DEFINITIONS.find(
          f => f.name === columnFieldName.toLowerCase()
        );
        setColumnFields(columnField ? [columnField] : []);
      } else {
        setColumnFields([]);
      }
    }
  }, [editingChart, isOpen]);

  // Handle field changes that should update the chart config
  const markFieldsChanged = () => {
    fieldsUpdateRequiredRef.current = true;
  };

  // Update chart config when fields change
  useEffect(() => {
    if (!editingChart || !fieldsUpdateRequiredRef.current) return;
    
    fieldsUpdateRequiredRef.current = false;
    
    if (rowFields.length > 0) {
      // Only update if values are actually different to prevent infinite loops
      const newXAxisLabel = rowFields[0].name;
      const newYAxisLabel = valueFields.length > 0 ? valueFields[0].name : undefined;
      const newColumnField = columnFields.length > 0 ? columnFields[0].name : undefined;
      
      setEditingChart({
        ...editingChart,
        xAxis: {
          type: "category",
          label: newXAxisLabel
        },
        // Update y-axis from value fields
        yAxis: newYAxisLabel ? {
          type: "value",
          label: newYAxisLabel
        } : undefined,
        // Update column field
        columnField: newColumnField
      });
    }
  }, [rowFields, columnFields, valueFields, editingChart, setEditingChart]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const sourceData = active.data.current as { field: Field; fromArea: FieldArea };
    const targetArea = over.id.toString() as FieldArea;
    
    // Only process if we're dropping to a different area
    if (sourceData.fromArea === targetArea) return;

    // Handle removal from source area
    if (sourceData.fromArea === "rows") {
      setRowFields(prev => prev.filter(f => f.name !== sourceData.field.name));
    } else if (sourceData.fromArea === "columns") {
      setColumnFields(prev => prev.filter(f => f.name !== sourceData.field.name));
    } else if (sourceData.fromArea === "values") {
      setValueFields(prev => prev.filter(f => f.name !== sourceData.field.name));
    }

    // Handle addition to target area
    if (targetArea === "rows") {
      setRowFields([sourceData.field]); // We only allow one row field
    } else if (targetArea === "columns") {
      setColumnFields([sourceData.field]); // We only allow one column field
    } else if (targetArea === "values") {
      setValueFields([sourceData.field]); // We only allow one value field
    }
    
    // Mark that fields have changed
    markFieldsChanged();
  };

  const removeField = (area: FieldArea, index: number) => {
    if (area === "rows") {
      setRowFields(prev => prev.filter((_, i) => i !== index));
    } else if (area === "columns") {
      setColumnFields(prev => prev.filter((_, i) => i !== index));
    } else if (area === "values") {
      setValueFields(prev => prev.filter((_, i) => i !== index));
    }
    
    // Mark that fields have changed
    markFieldsChanged();
  };
  
  if (!editingChart) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{isNewChart ? "Create New Chart" : "Edit Chart"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Chart Title</Label>
            <Input
              id="title"
              value={editingChart.title}
              onChange={(e) =>
                setEditingChart({ ...editingChart, title: e.target.value })
              }
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Chart Type</Label>
            <Select
              value={editingChart.type}
              onValueChange={(value: ChartType) =>
                setEditingChart({ ...editingChart, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DndContext 
            sensors={sensors} 
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="grid grid-cols-1 gap-4 mt-4">
              {/* Available Fields */}
              <div className="space-y-2">
                <Label>Available Fields</Label>
                <div className="p-3 border rounded-md flex flex-wrap gap-2">
                  {FIELD_DEFINITIONS.map((field) => (
                    <DraggableField
                      key={`available-${field.name}`}
                      id={`available-${field.name}`}
                      field={field}
                      area="available"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Rows (X-Axis) */}
                <DroppableArea
                  id="rows"
                  label="Rows (X-Axis)"
                  fields={rowFields}
                  onRemove={(index) => removeField("rows", index)}
                />

                {/* Columns (Series) */}
                <DroppableArea
                  id="columns"
                  label="Columns (Series)"
                  fields={columnFields}
                  onRemove={(index) => removeField("columns", index)}
                />

                {/* Values (Y-Axis) */}
                <DroppableArea
                  id="values"
                  label="Values (Y-Axis)"
                  fields={valueFields}
                  onRemove={(index) => removeField("values", index)}
                />
              </div>
            </div>
          </DndContext>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => {
            // Make sure any pending field changes are applied before saving
            if (rowFields.length > 0) {
              const newXAxisLabel = rowFields[0].name;
              const newYAxisLabel = valueFields.length > 0 ? valueFields[0].name : undefined;
              const newColumnField = columnFields.length > 0 ? columnFields[0].name : undefined;
              
              setEditingChart({
                ...editingChart,
                xAxis: {
                  type: "category",
                  label: newXAxisLabel
                },
                yAxis: newYAxisLabel ? {
                  type: "value",
                  label: newYAxisLabel
                } : undefined,
                columnField: newColumnField
              });
            }
            
            // Allow the state update to take effect before calling onSave
            setTimeout(onSave, 0);
          }}>
            {isNewChart ? "Create" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 