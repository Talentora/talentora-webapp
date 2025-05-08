import * as React from 'react';
import { LineChart } from '@mui/x-charts';
import { ChartConfig, ApplicantData, ValueFieldConfig } from '@/components/Reports/data/mock-data';
import { groupAndAggregate } from './BaseGraph';

interface LineChartComponentProps {
  config: ChartConfig;
  data: ApplicantData[];
}

export function LineChartComponent({ config, data }: LineChartComponentProps) {
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

  // MUI X-Charts LineChart expects:
  // - xAxis: [{ data: [...] }]
  // - series: [{ data: [...] }]
  // If you want to show a line, you must provide both and ensure data is not empty.

  // Defensive: If chartData is empty, show a fallback
  if (!xField || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data to display for this line chart.
      </div>
    );
  }

  // xAxis expects the x values (labels), series expects the y values
  // For line chart, the x values should be primitive (string/number), not objects
  // Also, sort by x if possible for a line chart
  let sortedChartData = chartData;
  // Try to sort numerically if possible, else lexically
  if (!isNaN(Number(sortedChartData[0].label))) {
    sortedChartData = [...chartData].sort((a, b) => Number(a.label) - Number(b.label));
  } else {
    sortedChartData = [...chartData].sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }

  const xAxis = [{ data: sortedChartData.map((d) => d.label), label: xField }];
  const series = [{ data: sortedChartData.map((d) => d.value), label: yField || "Count" }];

  return (
    <LineChart
      xAxis={xAxis}
      series={series}
      height={300}
    />
  );
}