import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/Toasts/use-toast';
import { Save } from 'lucide-react';

interface CandidateNotesProps {
  candidateId: string;
}

export default function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const { toast } = useToast();
  
  // Load initial notes if they exist
  useEffect(() => {
    const fetchCandidateNotes = async () => {
      if (!candidateId) return;
      
      try {
        // Check for existing candidate activities (notes)
        const response = await fetch(`/api/candidates/${candidateId}/activities?type=NOTE`);
        if (response.ok) {
          const data = await response.json();
          // If notes exist, use the most recent one
          if (data.results && data.results.length > 0) {
            // Sort by most recent and get the body
            const sortedNotes = data.results.sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            // setNotes(sortedNotes[0].body || '');
          }
        }
      } catch (error) {
        console.error('Error fetching candidate notes:', error);
      }
    };
    
    fetchCandidateNotes();
  }, [candidateId]);

  const saveNotes = async () => {
    if (!candidateId) return;
    
    setIsSavingNotes(true);
    try {
      const response = await fetch('/api/candidates/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: candidateId,
          notes: notes,
          visibility: 'PRIVATE' // or 'PUBLIC' based on requirements
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Candidate notes saved successfully',
          variant: 'default',
        });
      } else {
        throw new Error('Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving candidate notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save candidate notes',
        variant: 'destructive',
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="bg-background rounded-lg p-4 border shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          Candidate Notes
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveNotes}
          disabled={isSavingNotes}
        >
          {isSavingNotes ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Save className="h-4 w-4 mr-1" />
              Save Notes
            </span>
          )}
        </Button>
      </div>
      <Textarea
        className="min-h-[320px] resize-none"
        placeholder="Enter notes about this candidate..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
} 