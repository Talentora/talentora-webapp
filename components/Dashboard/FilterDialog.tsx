'use client';

import { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon } from 'lucide-react';

interface FilterDialogProps {
  filters: { departments: string[], locations: string[], statuses: string[] };
  setFilters: (filters: any) => void;
  filterOptions: { departments: string[], locations: string[], statuses: string[] };
  activeFilterCount: number;
}

export default function FilterDialog({ filters, setFilters, filterOptions, activeFilterCount }: FilterDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Jobs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FilterSection
            title="Department"
            options={filterOptions.departments}
            selectedOptions={filters.departments}
            onCheckedChange={(checked, option) => setFilters(prev => ({
              ...prev,
              departments: checked
                ? [...prev.departments, option]
                : prev.departments.filter(d => d !== option)
            }))}
          />
          <FilterSection
            title="Location"
            options={filterOptions.locations}
            selectedOptions={filters.locations}
            onCheckedChange={(checked, option) => setFilters(prev => ({
              ...prev,
              locations: checked
                ? [...prev.locations, option]
                : prev.locations.filter(l => l !== option)
            }))}
          />
          <FilterSection
            title="Status"
            options={filterOptions.statuses}
            selectedOptions={filters.statuses}
            onCheckedChange={(checked, option) => setFilters(prev => ({
              ...prev,
              statuses: checked
                ? [...prev.statuses, option]
                : prev.statuses.filter(s => s !== option)
            }))}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterSection({ title, options, selectedOptions, onCheckedChange }) {
  return (
    <div className="grid gap-2">
      <h3 className="font-medium">{title}</h3>
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}-${option}`}
            checked={selectedOptions.includes(option)}
            onCheckedChange={(checked) => onCheckedChange(checked, option)}
          />
          <label htmlFor={`${title.toLowerCase()}-${option}`}>{option}</label>
        </div>
      ))}
    </div>
  );
}
