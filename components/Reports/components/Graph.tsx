import { ChartConfig, ApplicantData } from "../../../app/(pages)/(restricted)/reports/data/mock-data";
import { useMemo } from "react";
import { BarChart } from "./graphs/BarChart";
import { LineChart } from "./graphs/LineChart";
import { PieChart } from "./graphs/PieChart";
import { PivotTable } from "./graphs/PivotTable";

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
        return <BarChart {...props} />;
      case "line":
        return <LineChart {...props} />;
      case "pie":
        return <PieChart {...props} />;
      case "pivot":
        return <PivotTable {...props} />;
      default:
        return <div>Unsupported chart type: {config.type}</div>;
    }
  }, [config, data, onEdit, onDuplicate, onDelete, onElementClick]);

  return renderChart;
};