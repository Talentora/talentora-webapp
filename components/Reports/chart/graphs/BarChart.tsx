import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import { ChartConfig, ApplicantData, ValueFieldConfig } from '@/components/Reports/data/mock-data';
import { getNestedValue } from '@/components/Reports/utils/getNestedValue';
import { groupAndAggregate } from './BaseGraph';

interface BarChartComponentProps {
  config: ChartConfig;
  data: ApplicantData[];
}

export function BarChartComponent({ config, data }: BarChartComponentProps) {
  const xField = config.rowFields[0];
  const valueConfig: ValueFieldConfig | undefined = config.valueFields[0];
  const yField = valueConfig?.field;
  const aggregation = valueConfig?.aggregation || "count";

  let chartData: { label: string; value: number }[] = [];

  if (xField && yField) {
    chartData = groupAndAggregate(data, xField, yField, aggregation);
  } else if (xField) {
    // If only xField, just count occurrences
    chartData = groupAndAggregate(data, xField, "", "count");
  }

  const xAxis = chartData.length > 0 ? [{ data: chartData.map((d) => d.label), label: xField }] : [];
  const series = chartData.length > 0 ? [{ data: chartData.map((d) => d.value), label: yField || "Count" }] : [];

  return (
    <BarChart
      series={series}
      xAxis={xAxis}
      height={300}
    />
  );
}