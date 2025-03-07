import React, { useEffect, useState } from 'react';
import { useRTVIClient } from '@pipecat-ai/client-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface InterviewTimerProps {
  onTimeUp?: () => void;
}

export default function InterviewTimer({ onTimeUp }: InterviewTimerProps) {
  const client = useRTVIClient();

  // Get the interview duration from the request data
  const requestData = client?.params.requestData as any;
  const interviewConfig = requestData?.data.jobInterviewConfig;
  
  // Fix: Ensure we have a proper duration value (in seconds)
  // Check if duration is provided in minutes and convert to seconds
  let interviewDuration = interviewConfig?.duration || 0;
  
  // If the value is very small (like 5), it might be in minutes instead of seconds
  if (interviewDuration > 0 && interviewDuration < 10) {
    // Convert from minutes to seconds
    interviewDuration = interviewDuration * 60;
  }
  
  // Provide a default duration (5 minutes) if duration is missing or invalid
  if (!interviewDuration || interviewDuration <= 0) {
    interviewDuration = 5 * 60; // 5 minutes in seconds
  }
  
  console.log('Interview duration in seconds:', interviewDuration);

  const [timeRemaining, setTimeRemaining] = useState(interviewDuration);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    console.log('Starting timer with duration:', interviewDuration);
    
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, interviewDuration - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining % 10 === 0) {
        console.log(`Time remaining: ${remaining} seconds`);
      }

      if (remaining === 0) {
        onTimeUp?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, interviewDuration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeRemaining / interviewDuration) * 100;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    // <div className="flex items-center gap-2 bg-background p-2 rounded-lg shadow-sm border border">
    //   <Clock
    //     className={`h-4 w-4 ${isLowTime ? 'text-red-500' : 'text-gray-500'}`}
    //   />
    //   <div className="flex flex-col gap-1 min-w-[150px]">
    //     <div className="flex justify-between items-center gap-2">
    //       <span className="text-sm font-medium">Time Remaining</span>
    //       {/* {JSON.stringify(requestData)} */}
    //       <Badge variant={isLowTime ? 'destructive' : 'success'}>
    //         {formatTime(timeRemaining)}
    //       </Badge>
    //     </div>
    //     <Progress
    //       value={progress}
    //       className="h-1"
    //       style={{ transform: 'scaleX(-1)' }}
    //     />
    //   </div>
    // </div>
    <div></div>
  );
}
