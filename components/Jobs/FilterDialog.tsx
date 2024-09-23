'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterIcon } from 'lucide-react';

interface FilterDialogProps {
  filters: { departments: string[]; locations: string[]; statuses: string[] };
  setFilters: (filters: {
    departments: string[];
    locations: string[];
    // statuses: string[];
  }) => void;
  filterOptions: {
    departments: string[];
    locations: string[];
    // statuses: string[];
  };
  activeFilterCount: number;
}

export default function FilterDialog({
  filters,
  setFilters,
  filterOptions,
  activeFilterCount
}: FilterDialogProps) {
  const handleCheckedChange = (type: 'departments' | 'locations', checked: boolean, option: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], option]
        : prev[type].filter((item: string) => item !== option)
    }));
  };

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
      <DialogContent className="w-[80vw] h-[80vh] sm:max-w-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Filter Jobs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:grid-cols-2">
          {['departments', 'locations'].map((type) => (
            <FilterSection
              key={type}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
              options={filterOptions[type]}
              selectedOptions={filters[type]}
              onCheckedChange={(checked: boolean, option: string) => handleCheckedChange(type as 'departments' | 'locations', checked, option)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onCheckedChange: (checked: boolean, option: string) => void;
}

function FilterSection({
  title,
  options,
  selectedOptions,
  onCheckedChange
}: FilterSectionProps) {
  return (
    <div className="grid gap-2">
      <h3 className="font-medium">{title}</h3>
      {options?.map((option: string) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}-${option}`}
            checked={selectedOptions.includes(option)}
            onCheckedChange={(checked: boolean) => onCheckedChange(checked, option)}
          />
          <label htmlFor={`${title.toLowerCase()}-${option}`}>{option}</label>
        </div>
      ))}
    </div>
  );
}
