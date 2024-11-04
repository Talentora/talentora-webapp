import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface HiringManagerInputProps {
  onCompletion: (isComplete: boolean) => void;
}

export const HiringManagerInput: React.FC<HiringManagerInputProps> = ({ onCompletion }) => {
  const [requirements, setRequirements] = useState('');
  const [idealCandidate, setIdealCandidate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSave = () => {
    // Validate that at least requirements or ideal candidate is filled
    const isComplete = requirements.trim() !== '' || idealCandidate.trim() !== '';
    onCompletion(isComplete);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Key Requirements & Qualifications
              </label>
              <Textarea
                placeholder="Enter the key requirements and qualifications the hiring manager is looking for..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Ideal Candidate Profile
              </label>
              <Textarea
                placeholder="Describe the ideal candidate in terms of experience, skills, and qualities..."
                value={idealCandidate}
                onChange={(e) => setIdealCandidate(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Additional Notes (Optional)
              </label>
              <Textarea
                placeholder="Any additional context or specific preferences..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button 
              className="w-full mt-4"
              onClick={handleSave}
              disabled={requirements.trim() === '' && idealCandidate.trim() === ''}
            >
              Save Requirements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
