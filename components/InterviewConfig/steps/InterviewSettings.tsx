'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/Toasts/use-toast';
import { Slider } from '@/components/ui/slider';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';

interface InterviewSettingsProps {
  jobId: string;
  onCompletion: (isComplete: boolean) => void;
}

export const InterviewSettings = ({
  jobId,
  onCompletion
}: InterviewSettingsProps) => {
  const [interviewName, setInterviewName] = useState('');
  const [duration, setDuration] = useState(30);
  const [interviewType, setInterviewType] = useState('standard');
  const [isLoading, setIsLoading] = useState(false); // Added state for loading
  const { toast } = useToast();

  //   // Check if required fields are filled to enable completion
  //   useEffect(() => {
  //     if (interviewName && duration && interviewType) {
  //     //   onCompletion(true);
  //     } else {
  //       onCompletion(false);
  //     }
  //   }, [interviewName, duration, interviewType, onCompletion]);

  const handleSave = async () => {
    setIsLoading(true); // Set loading to true when save is clicked
    try {
      if (interviewName && interviewType && duration) {
        // TODO: Implement save to database
        await updateJobInterviewConfig(jobId, {
          interview_name: interviewName,
          type: interviewType,
          duration: duration
        });
        toast({
          title: 'Settings saved successfully',
          description: 'Your interview settings have been updated'
        });
        onCompletion(true);
      }
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false); // Set loading to false after the operation
    }
  };

  return (
    <div className="space-y-4 m-10">
      <h2 className="text-2xl font-bold">Interview Settings</h2>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Name</label>
            <Input
              placeholder="e.g 'Sales Engineer Behavioral Interview'"
              value={interviewName}
              onChange={(e) => setInterviewName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={10}
                max={40}
                step={5}
              />
              <span>{duration} minutes</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Type</label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Interview</SelectItem>
                <SelectItem value="technical">Technical Assessment</SelectItem>
                <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                <SelectItem value="case">Case Study Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-32 mt-4 float-right"
            onClick={handleSave}
            disabled={
              !interviewName || !duration || !interviewType || isLoading
            } // Added isLoading to disable button
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSettings;
