import { ChartConfig, ApplicantData, ValueFieldConfig } from "@/components/Reports/data/mock-data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNestedValue } from "@/components/Reports/utils/getNestedValue";

// Helper: group data by a field and aggregate values
export function groupAndAggregate(
  data: ApplicantData[],
  groupField: string,
  valueField: string,
  aggregation: string = "count"
): { label: string; value: number }[] {
  const grouped: Record<string, any[]> = {};
  data.forEach((item) => {
    const groupKey = String(groupField ? getNestedValue(item, groupField) : "");
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(item);
  });

  const result: { label: string; value: number }[] = [];
  Object.entries(grouped).forEach(([label, items]) => {
    let value: number;
    if (aggregation === "count") {
      value = items.length;
    } else if (aggregation === "sum") {
      value = items.reduce(
        (acc, curr) => acc + (Number(getNestedValue(curr, valueField)) || 0),
        0
      );
    } else if (aggregation === "avg") {
      const sum = items.reduce(
        (acc, curr) => acc + (Number(getNestedValue(curr, valueField)) || 0),
        0
      );
      value = items.length > 0 ? sum / items.length : 0;
    } else {
      // fallback to count
      value = items.length;
    }
    result.push({ label, value });
  });
  return result;
}

export interface BaseGraphProps {
  config: ChartConfig;
  data: ApplicantData[];
  onEdit?: (chart: ChartConfig) => void;
  onDuplicate?: (chart: ChartConfig) => void;
  onDelete?: (chartId: string) => void;
  onElementClick?: (field: string, value: string) => void;
  children?: React.ReactNode;
}

export interface GraphDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const defaultDimensions: GraphDimensions = {
  width: 600,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
};

export const BaseGraph: React.FC<BaseGraphProps> = ({
  config,
  data,
  onEdit,
  onDuplicate,
  onDelete,
  onElementClick,
  children,
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
              <DropdownMenuItem
                onClick={() => onDelete(config.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative w-full aspect-[3/2]">
        {children}
      </div>
    </div>
  );
}; 