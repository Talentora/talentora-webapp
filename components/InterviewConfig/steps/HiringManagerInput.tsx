import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast'; // Import useToast hook
interface HiringManagerInputProps {
  onCompletion: (isComplete: boolean) => void;
  jobId: string;
}

export const HiringManagerInput: React.FC<HiringManagerInputProps> = ({ onCompletion, jobId }) => {
  const [requirements, setRequirements] = useState('');
  const [idealCandidate, setIdealCandidate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added state for loading
  const { toast } = useToast(); // Initialize toast hook

  const handleSave = async () => {
    setIsLoading(true); // Set loading to true when save is clicked
    try {
      await updateJobInterviewConfig(jobId, {
        hiring_manager_notes: additionalNotes
      });
      toast({
        title: "Success",
        description: "Additional notes saved successfully.",
        variant: "default",
      });
      // Validate that at least requirements or ideal candidate is filled
      const isComplete = requirements.trim() !== '' || idealCandidate.trim() !== '';
      onCompletion(isComplete);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save additional notes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Set loading to false after the operation
      onCompletion(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
        
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Additional Notes
              </label>
              <Textarea
                placeholder="Enter any additional context or specific preferences to tell the AI.  This will help it tailor the interview to the hiring manager's needs..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button 
              className="w-32 mt-4 float-right"
              onClick={handleSave}
              disabled={isLoading} // Added isLoading to disable button
            >
              {isLoading ? 'Saving...' : 'Save Requirements'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
