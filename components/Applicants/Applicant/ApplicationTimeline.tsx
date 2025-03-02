'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, Loader2 } from 'lucide-react';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InterviewStage {
  id: string;
  name: string;
  stage_order: number;
  job: string;
}

interface ApplicationTimelineProps {
  portalProps: portalProps;
}

export default function ApplicationTimeline({ portalProps }: ApplicationTimelineProps) {
  const { mergeApplicant } = portalProps;
  const [stages, setStages] = useState<InterviewStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStages = async () => {
      if (!mergeApplicant?.job?.id) {
        setIsLoading(false);
        setError('No job information available');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/job-interview-stages?job_id=${mergeApplicant.job.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch interview stages');
        }
        
        const data = await response.json();
        
        if (data.results && Array.isArray(data.results)) {
          // Sort stages by stage_order
          const sortedStages = [...data.results].sort((a, b) => a.stage_order - b.stage_order);
          setStages(sortedStages);
          
          // Set current stage from application data
          if (mergeApplicant.application?.current_stage) {
            setCurrentStageId(mergeApplicant.application.current_stage);
          }
        } else {
          setError('No interview stages found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching interview stages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStages();
  }, [mergeApplicant]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading interview stages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert intent="info" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (stages.length === 0) {
    return (
      <Alert intent="info" className="mb-4">
        <AlertDescription>No interview stages found for this position.</AlertDescription>
      </Alert>
    );
  }

  // Find the index of the current stage
  const currentStageIndex = stages.findIndex(stage => stage.id === currentStageId);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Application Progress</h3>
      <div className="relative">
        {/* Horizontal timeline line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
        
        {/* Timeline stages */}
        <div className="flex justify-between relative">
          {stages.map((stage, index) => {
            const isCompleted = currentStageIndex > index;
            const isCurrent = currentStageIndex === index;
            
            return (
              <div key={stage.id} className="flex flex-col items-center z-10">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className={`mt-2 text-center max-w-[100px] ${isCurrent ? 'font-medium' : ''}`}>
                  <h4 className={`text-sm ${isCurrent ? 'text-primary font-semibold' : isCompleted ? 'text-muted-foreground' : ''}`}>
                    {stage.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isCompleted 
                      ? 'Completed' 
                      : isCurrent 
                        ? 'Current' 
                        : 'Upcoming'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 