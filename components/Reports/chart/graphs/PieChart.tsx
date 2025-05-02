import * as React from 'react';
import { PieChart } from '@mui/x-charts';
import { ChartConfig, ApplicantData, ValueFieldConfig } from '@/components/Reports/data/mock-data';
import { groupAndAggregate } from './BaseGraph';

interface PieChartComponentProps {
  config: ChartConfig;
  data: ApplicantData[];
}

export function PieChartComponent({ config, data }: PieChartComponentProps) {
  const labelField = config.rowFields[0];
  const valueConfig: ValueFieldConfig | undefined = config.valueFields[0];
  const valueField = valueConfig?.field;
  const aggregation = valueConfig?.aggregation || "count";

  // Use groupAndAggregate to group and aggregate data for the pie chart
  let pieData: { label: string; value: number }[] = [];

  if (labelField && valueField) {
    pieData = groupAndAggregate(data, labelField, valueField, aggregation);
  } else if (labelField) {
    // If only labelField, just count occurrences
    pieData = groupAndAggregate(data, labelField, "", "count");
  }

  // PieChart expects { id, value, label }
  const chartData = pieData.map(d => ({
    id: d.label,
    value: d.value,
    label: d.label,
  }));

  return (
    <PieChart
      series={[{ data: chartData }]}
      height={300}
    />
  );
} 