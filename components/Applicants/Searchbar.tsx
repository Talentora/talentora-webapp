import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ApplicantCandidate } from '@/types/merge';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  applicants: ApplicantCandidate[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  applicants,
  searchTerm,
  setSearchTerm
}: SearchBarProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantCandidate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const router = useRouter();

  useEffect(() => {
    if (searchTerm) {
      const filtered = applicants.filter(applicant =>
        applicant.candidate?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.candidate?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApplicants(filtered);
      setShowPreview(true);
      setSelectedIndex(-1);
    } else {
      setShowPreview(false);
    }
  }, [searchTerm, applicants]);

  const getFullName = (applicant: ApplicantCandidate) => {
    const firstName = applicant.candidate?.first_name || '';
    const lastName = applicant.candidate?.last_name || '';
    return `${firstName} ${lastName}`.trim();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredApplicants.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredApplicants.length) {
        setSearchTerm(getFullName(filteredApplicants[selectedIndex]));
        setShowPreview(false);
      }
    }
  };

  const handleSelectApplicant = (applicant: ApplicantCandidate) => {
    // setSearchTerm(getFullName(applicant));
    // setShowPreview(false);
    router.push(`/applicants/${applicant.application.id}`);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search applicants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showPreview && filteredApplicants.length > 0 && (
        <div className="absolute z-10 w-full max-w-sm mt-1 bg-white border border-gray-200 rounded-md shadow-lg divide-y divide-gray-100">
          {filteredApplicants.slice(0, 5).map((applicant, index) => (
            <div 
              key={index}
              className={`p-3 cursor-pointer transition-colors ${
                index === selectedIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectApplicant(applicant)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium text-gray-900">
                  {getFullName(applicant)}
                </div>
                <div className="text-sm text-gray-500">
                  {applicant.candidate.email_addresses?.[0]?.value || 'No email'}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-dark font-medium">
                    {applicant.job.name || 'No role specified'}
                  </span>
                  <span className="text-gray-400">
                    {new Date(applicant.application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
