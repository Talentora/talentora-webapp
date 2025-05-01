import { BaseGraph, BaseGraphProps } from "./BaseGraph";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { processData } from "@/components/Reports/utils/chartDataProcessor";
import { useMemo } from "react";

export const PivotTable: React.FC<BaseGraphProps> = (props) => {
  const { config, data, onElementClick } = props;
  
  const processedData = useMemo(() => {
    const result = processData(data, {
      rowFields: config.rowFields,
      colFields: config.colFields,
      valueFields: config.valueFields,
      aggregation: config.aggregation
    });
    return result;
  }, [data, config]);

  // Get unique column values for pivot table
  const columns = useMemo(() => {
    if (!config.colFields.length) {
      return ['Value'];
    }
    return Array.from(new Set(processedData.map(d => d[config.colFields[0]])));
  }, [processedData, config.colFields]);

  const handleCellClick = (rowValue: string) => {
    if (onElementClick && config.rowFields[0]) {
      onElementClick(config.rowFields[0], rowValue);
    }
  };

  return (
    <BaseGraph {...props}>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{config.rowFields[0] || 'Category'}</TableHead>
              {columns.map((col) => (
                <TableHead key={col} className="text-right">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((row) => (
              <TableRow 
                key={row[config.rowFields[0]]}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleCellClick(row[config.rowFields[0]])}
              >
                <TableCell className="font-medium">
                  {row[config.rowFields[0]]}
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col} className="text-right">
                    {typeof row[col] === 'number' 
                      ? row[col].toLocaleString()
                      : row[config.valueFields[0] || 'value']?.toLocaleString() || '0'
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseGraph>
  );
}; 