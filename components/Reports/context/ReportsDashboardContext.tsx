"use client";
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { initialCharts, type ChartConfig} from "@/components/Reports/data/mock-data";
import { type ApplicantData } from "../data/fake-data";

interface Filters {
  jobNames: string[];
  stages: string[];
  locations: string[];
  jobStatuses: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  jobSearch: string;
}

interface ChartFilter {
  field: string;
  value: string;
}

interface ReportsDashboardContextType {
  applicantData: ApplicantData[];
  charts: ChartConfig[];
  setCharts: React.Dispatch<React.SetStateAction<ChartConfig[]>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredData: ApplicantData[];
  setFilteredData: React.Dispatch<React.SetStateAction<ApplicantData[]>>;
  editingChart: ChartConfig | null;
  setEditingChart: React.Dispatch<React.SetStateAction<ChartConfig | null>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNewChart: boolean;
  setIsNewChart: React.Dispatch<React.SetStateAction<boolean>>;
  chartFilter: ChartFilter | null;
  setChartFilter: React.Dispatch<React.SetStateAction<ChartFilter | null>>;
  applyFilters: () => void;
  openEditDialog: (chart: ChartConfig) => void;
  openNewChartDialog: () => void;
  removeChart: (chartId: string) => void;
  duplicateChart: (chart: ChartConfig) => void;
  saveChartChanges: () => void;
  handleChartElementClick: (field: string, value: string) => void;
  clearChartFilter: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ReportsDashboardContext = createContext<ReportsDashboardContextType | undefined>(undefined);

export function ReportsDashboardProvider({ applicantData, children }: { applicantData: ApplicantData[]; children: React.ReactNode }) {
  const [charts, setCharts] = useState<ChartConfig[]>(initialCharts);
  const [filteredData, setFilteredData] = useState<ApplicantData[]>(applicantData);
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueLocations = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.candidate && d.candidate.locations && d.candidate.locations.length > 0)
      .map(d => d.candidate?.locations?.[0]?.name || 'Unknown')
      .filter(Boolean) as string[])), 
    [applicantData]
  );
  
  const uniqueJobNames = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.job && d.job.name)
      .map(d => d.job?.name || 'Unknown'))), 
    [applicantData]
  );
  
  const uniqueStages = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.interviewStages && d.interviewStages.name)
      .map(d => d.interviewStages?.name || 'Unknown'))), 
    [applicantData]
  );
  
  const uniqueJobStatuses = useMemo(() => 
    Array.from(new Set(applicantData
      .filter(d => d.job && d.job.status)
      .map(d => d.job?.status || 'Unknown'))), 
    [applicantData]
  );

  const [filters, setFilters] = useState<Filters>({
    jobNames: [...uniqueJobNames],
    stages: [...uniqueStages],
    locations: [...uniqueLocations],
    jobStatuses: [...uniqueJobStatuses],
    dateRange: {
      start: null,
      end: null
    },
    jobSearch: ""
  });

  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewChart, setIsNewChart] = useState(false);
  const [chartFilter, setChartFilter] = useState<ChartFilter | null>(null);

  const applyFilters = useCallback(() => {
    let result = applicantData;
    
    if (filters.locations.length > 0) {
      result = result.filter(d => {
        if (!d.candidate?.locations || d.candidate.locations.length === 0) return false;
        return filters.locations.includes(d.candidate.locations[0]?.name || 'Unknown');
      });
    }
    
    if (filters.jobNames.length > 0) {
      result = result.filter(d => 
        filters.jobNames.includes(d.job?.name || 'Unknown')
      );
    }
    
    if (filters.stages.length > 0) {
      result = result.filter(d => 
        filters.stages.includes(d.interviewStages?.name || 'Unknown')
      );
    }
    
    if (filters.jobStatuses.length > 0) {
      result = result.filter(d => 
        filters.jobStatuses.includes(d.job?.status || 'Unknown')
      );
    }
    
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(d => {
        const appDate = d.application?.created_at ? new Date(d.application.created_at) : null;
        if (!appDate) return false;
        
        if (filters.dateRange.start && filters.dateRange.end) {
          return appDate >= filters.dateRange.start && appDate <= filters.dateRange.end;
        } else if (filters.dateRange.start) {
          return appDate >= filters.dateRange.start;
        } else if (filters.dateRange.end) {
          return appDate <= filters.dateRange.end;
        }
        
        return true;
      });
    }
    
    setFilteredData(result);
  }, [filters, applicantData]);

  const openEditDialog = (chart: ChartConfig) => {
    setIsNewChart(false);
    setEditingChart({...chart});
    setIsEditDialogOpen(true);
  };

  const openNewChartDialog = () => {
    setIsNewChart(true);
    setEditingChart({
      id: `chart${charts.length + 1}`,
      type: "line",
      title: "New Chart",
      rowFields: [],
      colFields: [],
      valueFields: [],
      aggregation: "count"
    });
    setIsEditDialogOpen(true);
  };

  const removeChart = (chartId: string) => {
    setCharts(charts.filter(c => c.id !== chartId));
  };

  const duplicateChart = (chartToDuplicate: ChartConfig) => {
    const newChart = {
      ...chartToDuplicate,
      id: `chart${charts.length + 1}`,
      title: `${chartToDuplicate.title} (Copy)`
    };
    setCharts([...charts, newChart]);
  };

  const saveChartChanges = () => {
    if (editingChart) {
      if (isNewChart) {
        setCharts([...charts, editingChart]);
      } else {
        setCharts(charts.map(c => 
          c.id === editingChart.id ? editingChart : c
        ));
      }
      setIsEditDialogOpen(false);
      setEditingChart(null);
      setIsNewChart(false);
    }
  };

  const handleChartElementClick = (field: string, value: string) => {
    setChartFilter({ field, value });
  };

  const clearChartFilter = () => {
    setChartFilter(null);
  };

  return (
    <ReportsDashboardContext.Provider
      value={{
        applicantData,
        charts,
        setCharts,
        filters,
        setFilters,
        filteredData,
        setFilteredData,
        editingChart,
        setEditingChart,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isNewChart,
        setIsNewChart,
        chartFilter,
        setChartFilter,
        applyFilters,
        openEditDialog,
        openNewChartDialog,
        removeChart,
        duplicateChart,
        saveChartChanges,
        handleChartElementClick,
        clearChartFilter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ReportsDashboardContext.Provider>
  );
}

export function useReportsDashboard() {
  const context = useContext(ReportsDashboardContext);
  if (!context) {
    throw new Error("useReportsDashboard must be used within a ReportsDashboardProvider");
  }
  return context;
} 