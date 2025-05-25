import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { EnrichedJob } from './types';
import { useRouter } from 'next/navigation';

interface SearchFilterProps {
  jobs: EnrichedJob[];
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function SearchFilter({ jobs, searchTerm, onSearch }: SearchFilterProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<EnrichedJob[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(job =>
        job.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
      setShowPreview(true);
      setSelectedIndex(-1);
    } else {
      setShowPreview(false);
    }
  }, [searchTerm, jobs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredJobs.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredJobs.length) {
        onSearch(filteredJobs[selectedIndex].name || '');
        setShowPreview(false);
      }
    }
  };

  const handleSelectJob = (job: EnrichedJob) => {
    router.push(`/jobs/${job.id}`);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-sm"
        />
      </div>
    </div>
  );
}
