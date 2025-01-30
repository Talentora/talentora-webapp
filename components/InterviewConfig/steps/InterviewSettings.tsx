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
import { Tables } from '@/types/types_db';
import { Skeleton } from '@/components/ui/skeleton';

interface InterviewSettingsProps {
  jobId: string;
  onCompletion: (isComplete: boolean) => void;
  existingConfig?: Tables<'job_interview_config'> | null;
}

const SettingsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-3/4" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="flex justify-end">
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export const InterviewSettings = ({
  jobId,
  onCompletion,
  existingConfig
}: InterviewSettingsProps) => {
  const [interviewName, setInterviewName] = useState(existingConfig?.interview_name || '');
  const [duration, setDuration] = useState(existingConfig?.duration || 30);
  const [interviewType, setInterviewType] = useState(existingConfig?.type || 'standard');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (existingConfig) {
      setInterviewName(existingConfig.interview_name || '');
      setDuration(existingConfig.duration || 30);
      setInterviewType(existingConfig.type || 'standard');
    }
  }, [existingConfig]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (interviewName && interviewType && duration) {
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
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 m-10">
     

      <Card className="p-2 border-none">
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <SettingsSkeleton />
          ) : (
            <>
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
                disabled={!interviewName || !duration || !interviewType || isLoading}
              >
                {isLoading ? 'Saving...' : existingConfig ? 'Update' : 'Save Settings'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSettings;
