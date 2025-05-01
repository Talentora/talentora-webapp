import { BaseGraph, BaseGraphProps } from "./BaseGraph";
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { processData } from "../utils/chartDataProcessor";
import { useMemo } from "react";

export const LineChart: React.FC<BaseGraphProps> = ({ config, data, ...rest }) => {
  // Get safe values for required fields
  const rowFields = useMemo(() => config?.rowFields ?? [], [config?.rowFields]);
  const colFields = useMemo(() => config?.colFields ?? [], [config?.colFields]);
  const valueFields = useMemo(() => config?.valueFields ?? [], [config?.valueFields]);
  const aggregation = useMemo(() => config?.aggregation ?? "count", [config?.aggregation]);

  const processedData = useMemo(() => {
    return processData(data, {
      rowFields,
      colFields,
      valueFields,
      aggregation
    });
  }, [data, rowFields, colFields, valueFields, aggregation]);

  return (
    <BaseGraph config={config} data={data} {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={rowFields[0]} 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={valueFields[0] || "value"}
            stroke="#8884d8"
            name={valueFields[0] || "Count"}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </BaseGraph>
  );
}; 