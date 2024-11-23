import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';

export function SearchFilter({
  onSearch,
  searchTerm
}: {
  onSearch: (term: string) => void;
  searchTerm: string;
}) {
  const [search, setSearch] = useState(searchTerm);


  return (
    <div className="mb-4 flex flex-row gap-2 justify-end">
      <Input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-3xl bg-foreground"
      />
      <Button variant="outline" className='bg-accent text-foreground rounded-3xl' onClick={() => onSearch(search)}>Search</Button>
    </div>
  );
}
