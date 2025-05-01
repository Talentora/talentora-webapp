import { BaseGraph, BaseGraphProps } from "./BaseGraph";
import {
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { processData } from "../utils/chartDataProcessor";
import { useMemo } from "react";

// Color palette for pie chart segments
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe',
  '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

export const PieChart: React.FC<BaseGraphProps> = (props) => {
  const { config, data } = props;
  
  const processedData = useMemo(() => {
    const result = processData(data, {
      rowFields: config.rowFields,
      colFields: config.colFields,
      valueFields: config.valueFields,
      aggregation: config.aggregation
    });
    return result;
  }, [data, config]);

  return (
    <BaseGraph {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={processedData}
            dataKey={config.valueFields[0] || "value"}
            nameKey={config.rowFields[0]}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={(entry) => entry.name}
            labelLine
          >
            {processedData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </BaseGraph>
  );
}; 