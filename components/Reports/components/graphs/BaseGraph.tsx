import { ChartConfig, ApplicantData } from "../../../../app/(pages)/(restricted)/reports/data/mock-data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    bottom: 40,
    left: 60,
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