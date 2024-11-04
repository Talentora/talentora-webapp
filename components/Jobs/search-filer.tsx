import { Input } from '@/components/ui/input';

export function SearchFilter({
  onSearch,
  searchTerm
}: {
  onSearch: (term: string) => void;
  searchTerm: string;
}) {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
