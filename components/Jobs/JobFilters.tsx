import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Filter, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void
  initialFilters?: JobFilters
  departments: string[]
}

export interface JobFilters {
  status: {
    open: boolean
    closed: boolean
    draft: boolean
  }
  configured: {
    yes: boolean
    no: boolean
  }
  department: {
    [key: string]: boolean
  }
}

export function JobFilters({ onFilterChange, initialFilters, departments }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>(
    initialFilters || {
      status: {
        open: false,
        closed: false,
        draft: false,
      },
      configured: {
        yes: false,
        no: false,
      },
      department: {},
    }
  )

  const handleFilterChange = (
    category: keyof JobFilters,
    subcategory: string,
    value?: boolean
  ) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [subcategory]: value ?? !filters[category][subcategory],
      },
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      status: {
        open: false,
        closed: false,
        draft: false,
      },
      configured: {
        yes: false,
        no: false,
      },
      department: {},
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-accent text-foreground rounded-full">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Filter Jobs</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-2 gap-6 p-4">
            <div className="space-y-4">
              <FilterSection title="Status">
                <FilterCheckbox
                  id="status-open"
                  label="Open"
                  checked={filters.status.open}
                  onCheckedChange={() => handleFilterChange('status', 'open')}
                />
                <FilterCheckbox
                  id="status-closed"
                  label="Closed"
                  checked={filters.status.closed}
                  onCheckedChange={() => handleFilterChange('status', 'closed')}
                />
                <FilterCheckbox
                  id="status-draft"
                  label="Draft"
                  checked={filters.status.draft}
                  onCheckedChange={() => handleFilterChange('status', 'draft')}
                />
              </FilterSection>

              <FilterSection title="Configuration Status">
                <FilterCheckbox
                  id="configured-yes"
                  label="Configured"
                  checked={filters.configured.yes}
                  onCheckedChange={() => handleFilterChange('configured', 'yes')}
                />
                <FilterCheckbox
                  id="configured-no"
                  label="Not Configured"
                  checked={filters.configured.no}
                  onCheckedChange={() => handleFilterChange('configured', 'no')}
                />
              </FilterSection>
            </div>

            <div className="space-y-4">
              <FilterSection title="Departments">
                <ScrollArea className="h-[200px] pr-4">
                  {departments.map((dept) => (
                    <FilterCheckbox
                      key={dept}
                      id={`dept-${dept}`}
                      label={dept}
                      checked={filters.department[dept.toLowerCase()] || false}
                      onCheckedChange={() => handleFilterChange('department', dept.toLowerCase())}
                    />
                  ))}
                </ScrollArea>
              </FilterSection>
            </div>
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
          <Button onClick={() => onFilterChange(filters)}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="grid gap-2">{children}</div>
    </div>
  )
}

function FilterCheckbox({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  )
}

