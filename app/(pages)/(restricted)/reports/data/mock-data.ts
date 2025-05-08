export interface ApplicantData {
  candidate?: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses?: { email?: string }[];
    title?: string;
    locations?: { name?: string }[];
    applications?: string[];
    created_at?: string;
    modified_at?: string;
  };
  job?: {
    id: string;
    name: string;
    status: string;
    description?: string;
    code?: string;
  };
  application?: {
    id: string;
    job_id: string;
    created_at: string;
    current_stage: string;
  };
  interviewStages?: {
    id: string;
    name: string;
    job: string;
    stage_order: number;
  };
  hasMergeData?: boolean;
  hasSupabaseData?: boolean;
}

export type ChartType = "bar" | "line" | "scatter" | "pie" | "area" | "pivot";

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  
  // Fields for data configuration
  rowFields: string[];    // X-axis fields for charts, row fields for pivot
  colFields: string[];    // Series fields for charts, column fields for pivot
  valueFields: string[];  // Y-axis fields for charts, value fields for pivot
  aggregation?: string;   // Aggregation method (count, sum, avg, etc.)
}

export type MetricType = "value" | "time" | "category";

// We don't need the mock data generator anymore since we're using real data
export function generateMockData(count: number): ApplicantData[] {
  return [];
}

export const initialCharts: ChartConfig[] = [
  {
    id: "chart1",
    type: "line",
    title: "Applications Over Time",
    rowFields: ["application.created_at"],
    colFields: [],
    valueFields: [],
    aggregation: "count"
  },
  {
    id: "chart2",
    type: "pie",
    title: "Job Distribution",
    rowFields: ["job.name"],
    colFields: [],
    valueFields: [],
    aggregation: "count"
  },
  {
    id: "chart3",
    type: "bar",
    title: "Stage Distribution",
    rowFields: ["interviewStages.name"],
    colFields: [],
    valueFields: [],
    aggregation: "count"
  },
  {
    id: "chart4",
    type: "bar",
    title: "Locations Distribution",
    rowFields: ["candidate.locations[0].name"],
    colFields: [],
    valueFields: [],
    aggregation: "count"
  }
]; 