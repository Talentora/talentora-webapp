'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, PlusIcon } from 'lucide-react';
import FilterDialog from './FilterDialog';

interface JobPostingsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  filterOptions: any;
}

export default function JobPostingsHeader({ searchTerm, setSearchTerm,filters,setFilters,filterOptions }: JobPostingsHeaderProps) {

  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
      <h1 className="text-2xl font-bold">Job Postings</h1>
      <div className="flex items-center space-x-4">
        <form className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            placeholder="Search jobs..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <FilterDialog
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          activeFilterCount={0}
        />
      </div>
    </div>
  );
}
