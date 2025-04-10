import { BaseGraph, BaseGraphProps } from "./BaseGraph";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { processData } from "../utils/chartDataProcessor";
import { useMemo } from "react";

export const BarChart: React.FC<BaseGraphProps> = (props) => {
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
        <RechartsBarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={config.rowFields[0]} 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey={config.valueFields[0] || "value"}
            fill="#8884d8"
            name={config.valueFields[0] || "Count"}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </BaseGraph>
  );
}; 