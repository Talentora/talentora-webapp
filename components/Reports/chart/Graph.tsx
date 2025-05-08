import { ChartConfig, ApplicantData } from "@/components/Reports/data/mock-data";
import { useMemo } from "react";
import { BarChartComponent } from "./graphs/BarChart";
import { LineChartComponent } from "./graphs/LineChart";
import { PieChartComponent } from "./graphs";
import { ScatterChartComponent } from "./graphs/ScatterChart";

interface GraphComponentProps {
  config: ChartConfig;
  data: ApplicantData[];
  onEdit?: (chart: ChartConfig) => void;
  onDuplicate?: (chart: ChartConfig) => void;
  onDelete?: (chartId: string) => void;
  onElementClick?: (field: string, value: string) => void;
}

export const GraphComponent: React.FC<GraphComponentProps> = ({
  config,
  data,
  onEdit,
  onDuplicate,
  onDelete,
  onElementClick,
}) => {
  const renderChart = useMemo(() => {
    const props = {
      config,
      data,
      onEdit,
      onDuplicate,
      onDelete,
      onElementClick,
    };

    switch (config.type) {
      case "bar":
        return <BarChartComponent {...props} />;
      case "line":
        return <LineChartComponent {...props} />;
      case "pie":
        return <PieChartComponent {...props} />;
      case "scatter":
        return <ScatterChartComponent {...props} />;
      default:
        return <div>Unsupported chart type: {config.type}</div>;
    }
  }, [config, data, onEdit, onDuplicate, onDelete, onElementClick]);

  return renderChart;
};