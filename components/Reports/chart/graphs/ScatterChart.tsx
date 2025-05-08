import * as React from 'react';
import { ScatterChart } from '@mui/x-charts';
import { ChartConfig, ApplicantData, ValueFieldConfig } from '@/components/Reports/data/mock-data';
import { getNestedValue } from '@/components/Reports/utils/getNestedValue';

interface ScatterChartComponentProps {
  config: ChartConfig;
  data: ApplicantData[];
}

export function ScatterChartComponent({ config, data }: ScatterChartComponentProps) {
  const xField = config.rowFields[0];
  const yField = config.valueFields[0]?.field;
  const scatterData = data.map((d: ApplicantData) => ({
    x: getNestedValue(d, xField),
    y: getNestedValue(d, yField),
    id: getNestedValue(d, xField),
  }));

  return (
    <ScatterChart
      series={[{ data: scatterData }]}
      height={300}
    />
  );
} 