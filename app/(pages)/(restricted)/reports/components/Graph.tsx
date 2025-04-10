import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  ScatterChart, Scatter,
  PieChart, Pie,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  Label
} from "recharts";
import { ChartConfig } from "../data/mock-data";
import { useMemo } from "react";
import { MoreHorizontal, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface GraphComponentProps {
  config: ChartConfig;
  data: any[];
  onEdit?: (chart: ChartConfig) => void;
  onDuplicate?: (chart: ChartConfig) => void;
  onDelete?: (chartId: string) => void;
  showControls?: boolean;
}

// Field type definitions
type FieldType = "string" | "number";

interface Field {
  name: string;
  type: FieldType;
  label: string;
}

// Available operations for numeric fields (pivot functions)
type Operation = "count" | "sum" | "average" | "min" | "max";

const FIELD_DEFINITIONS: Field[] = [
  { name: "experience", type: "number", label: "Experience 🔢" },
  { name: "age", type: "number", label: "Age 🔢" },
  { name: "education", type: "string", label: "Education 📝" },
  { name: "location", type: "string", label: "Location 📝" },
  { name: "skills", type: "string", label: "Skills 📝" },
  { name: "job", type: "string", label: "Job Title 📝" }
];

interface NumericOperation {
  value: Operation;
  label: string;
}

const NUMERIC_OPERATIONS: NumericOperation[] = [
  { value: "count", label: "Count (#)" },
  { value: "sum", label: "Sum (Σ)" },
  { value: "average", label: "Average (μ)" },
  { value: "min", label: "Minimum (↓)" },
  { value: "max", label: "Maximum (↑)" }
];

// Enhanced data processing function to support pivot-like functionality
const processData = (data: any[], config: ChartConfig) => {
  if (!data.length) return [];

  // Get field definitions for rows (X-axis) and values
  const rowField = FIELD_DEFINITIONS.find(f => f.name === config.xAxis.label.toLowerCase());
  const valueField = FIELD_DEFINITIONS.find(f => f.name === config.yAxis?.label.toLowerCase());
  
  if (!rowField) return [];

  const rowKey = config.xAxis.type === "time" ? "time" : 
                config.xAxis.type === "category" ? "category" : 
                rowField.name;

  const valueKey = config.yAxis?.label.toLowerCase() || "value";
  const operation = NUMERIC_OPERATIONS.find(op => op.value === valueKey)?.value;

  // If config has a column field (for multi-series data)
  let columnField = null;
  if (typeof config.columnField === 'string' && config.columnField.length > 0) {
    columnField = FIELD_DEFINITIONS.find(f => f.name === config.columnField!.toLowerCase());
  }

  // If no column field is specified, process as before
  if (!columnField) {
    // If no operation is specified and y-axis is a direct field, return original data
    if (!operation) {
      return data.map(item => ({
        [rowKey]: item[rowField.name],
        [valueKey]: item[valueField?.name || "value"]
      }));
    }

    // Group data by row value (X-axis)
    const groupedData = data.reduce((acc: Record<string, any[]>, item: any) => {
      const key = item[rowField.name];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    // Apply aggregation for each group
    return Object.entries(groupedData).map(([key, items]) => {
      let value: number;
      const numericField = valueField?.type === "number" ? valueField.name : 
                          rowField.type === "number" ? rowField.name : null;

      if (!numericField) {
        value = items.length; // Default to count for non-numeric fields
      } else {
        switch (operation) {
          case "count":
            value = items.length;
            break;
          case "sum":
            value = items.reduce((sum: number, item: any) => sum + (Number(item[numericField]) || 0), 0);
            break;
          case "average":
            value = items.reduce((sum: number, item: any) => sum + (Number(item[numericField]) || 0), 0) / items.length;
            break;
          case "min":
            value = Math.min(...items.map((item: any) => Number(item[numericField]) || 0));
            break;
          case "max":
            value = Math.max(...items.map((item: any) => Number(item[numericField]) || 0));
            break;
          default:
            value = items.length;
        }
      }

      return {
        [rowKey]: key,
        [valueKey]: value
      };
    });
  } else {
    // For pivot table functionality with rows, columns and values
    // First, get unique column values
    const uniqueColumnValues = Array.from(new Set(data.map(item => item[columnField.name])));
    
    // Group data by row value
    const pivotData: Record<string, Record<string, any[]>> = {};
    
    data.forEach(item => {
      const rowValue = item[rowField.name];
      const colValue = item[columnField.name];
      
      if (!pivotData[rowValue]) {
        pivotData[rowValue] = {};
      }
      
      if (!pivotData[rowValue][colValue]) {
        pivotData[rowValue][colValue] = [];
      }
      
      pivotData[rowValue][colValue].push(item);
    });
    
    // Apply aggregation for each cell in the pivot
    return Object.entries(pivotData).map(([rowValue, columns]) => {
      const result: any = { [rowKey]: rowValue };
      
      uniqueColumnValues.forEach(colValue => {
        const items = columns[colValue] || [];
        const numericField = valueField?.type === "number" ? valueField.name : 
                            rowField.type === "number" ? rowField.name : null;
        
        let value: number = 0;
        
        if (!numericField || !items.length) {
          value = items.length; // Default to count or 0 if no items
        } else {
          switch (operation) {
            case "count":
              value = items.length;
              break;
            case "sum":
              value = items.reduce((sum: number, item: any) => sum + (Number(item[numericField]) || 0), 0);
              break;
            case "average":
              value = items.length ? items.reduce((sum: number, item: any) => sum + (Number(item[numericField]) || 0), 0) / items.length : 0;
              break;
            case "min":
              value = items.length ? Math.min(...items.map((item: any) => Number(item[numericField]) || 0)) : 0;
              break;
            case "max":
              value = items.length ? Math.max(...items.map((item: any) => Number(item[numericField]) || 0)) : 0;
              break;
            default:
              value = items.length;
          }
        }
        
        // Use column value as the key for this data point
        result[`${colValue}`] = value;
      });
      
      return result;
    });
  }
};

export const GraphComponent = ({ 
  config, 
  data,
  onEdit,
  onDuplicate,
  onDelete,
  showControls = true
}: GraphComponentProps) => {
  const processedData = useMemo(() => processData(data, config), [data, config]);
  
  // Get unique series names for multi-series charts (when using column field)
  const seriesKeys = useMemo(() => {
    if (!config.columnField || !processedData.length) return [config.yAxis?.label.toLowerCase() || "value"];
    
    // Extract all keys except the row key
    const firstRow = processedData[0];
    const rowKey = config.xAxis.type === "time" ? "time" : 
                  config.xAxis.type === "category" ? "category" : 
                  config.xAxis.label.toLowerCase();
                  
    return Object.keys(firstRow).filter(key => key !== rowKey);
  }, [processedData, config]);

  // State for legend visibility and position
  const [legendPosition, setLegendPosition] = useState<"top" | "bottom" | "hidden">("top");

  const ChartWrapper = ({ children }: { children: React.ReactElement }) => (
    <div className="space-y-4">
      {showControls && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{config.title}</h3>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(config)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={() => onDuplicate(config)}>
                    Duplicate
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(config.id)}>
                    Remove
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Legend
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={legendPosition} onValueChange={(value) => setLegendPosition(value as "top" | "bottom" | "hidden")}>
                      <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="hidden">Hidden</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );

  // Get the row key for X-axis
  const rowKey = config.xAxis.type === "time" ? "time" : 
                config.xAxis.type === "category" ? "category" : 
                config.xAxis.label.toLowerCase();

  // Generate random colors for multiple series
  const getSeriesColor = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
    return colors[index % colors.length];
  };

  // Get more descriptive axis labels from the field definitions
  const getAxisLabel = (fieldName?: string): string => {
    if (!fieldName) return '';
    
    const field = FIELD_DEFINITIONS.find(f => f.name === fieldName.toLowerCase());
    if (field) {
      // Strip emoji from the label for cleaner axis display
      return field.label.replace(/[\u{1F300}-\u{1F6FF}]/gu, '').trim();
    }
    
    // Check if it's an operation
    const operation = NUMERIC_OPERATIONS.find(op => op.value === fieldName.toLowerCase());
    if (operation) {
      return operation.label;
    }
    
    return fieldName;
  };

  const xAxisLabel = getAxisLabel(config.xAxis.label);
  const yAxisLabel = getAxisLabel(config.yAxis?.label);
  const columnLabel = getAxisLabel(config.columnField);

  // Helper function to add a Legend component based on the current state
  const renderLegend = () => {
    if (legendPosition === "hidden") {
      return null;
    }
    return <Legend layout="horizontal" verticalAlign={legendPosition} align="center" />;
  };

  switch (config.type) {
    case "line":
      return (
        <ChartWrapper>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={rowKey}
              height={50}
            >
              <Label value={xAxisLabel} position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis width={60}>
              <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            {renderLegend()}
            {seriesKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={getSeriesColor(index)} 
                name={columnLabel ? `${columnLabel}: ${key}` : key}
              />
            ))}
          </LineChart>
        </ChartWrapper>
      );
    case "bar":
      return (
        <ChartWrapper>
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={rowKey}
              height={50}
            >
              <Label value={xAxisLabel} position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis width={60}>
              <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            {renderLegend()}
            {seriesKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={getSeriesColor(index)} 
                name={columnLabel ? `${columnLabel}: ${key}` : key}
              />
            ))}
          </BarChart>
        </ChartWrapper>
      );
    case "area":
      return (
        <ChartWrapper>
          <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={rowKey}
              height={50}
            >
              <Label value={xAxisLabel} position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis width={60}>
              <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            {renderLegend()}
            {seriesKeys.map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                fill={getSeriesColor(index)} 
                stroke={getSeriesColor(index)}
                name={columnLabel ? `${columnLabel}: ${key}` : key}
              />
            ))}
          </AreaChart>
        </ChartWrapper>
      );
    case "pie":
      return (
        <ChartWrapper>
          <PieChart>
            <Pie
              data={processedData}
              dataKey={seriesKeys[0]}
              nameKey={rowKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({name}) => `${name}: ${xAxisLabel}`}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeriesColor(index)} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, `${name} (${yAxisLabel})`]} />
            {legendPosition !== "hidden" && 
              <Legend 
                layout="horizontal" 
                verticalAlign={legendPosition} 
                align="center" 
                formatter={(value) => `${value} (${xAxisLabel})`} 
              />
            }
          </PieChart>
        </ChartWrapper>
      );
    case "scatter":
      return (
        <ChartWrapper>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey={rowKey} 
              name={xAxisLabel}
              height={50}
            >
              <Label value={xAxisLabel} position="insideBottom" offset={-5} />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey={seriesKeys[0]} 
              name={yAxisLabel}
              width={60}
            >
              <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {renderLegend()}
            <Scatter 
              name={columnLabel || config.title} 
              data={processedData} 
              fill="#8884d8" 
            />
          </ScatterChart>
        </ChartWrapper>
      );
    default:
      return null;
  }
};