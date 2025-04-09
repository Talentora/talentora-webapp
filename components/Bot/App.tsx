'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LiveKitRoom, Toast } from '@livekit/components-react';
import '@livekit/components-styles';
import { useBotContext } from './BotContext';
import Configure from './Setup';
import VideoInterviewSession from './VideoInterviewSession';

// Remove ScoutProps interface definition
// interface ScoutProps { ... }

// App no longer accepts props directly
export default function App() {
  const { 
    application, 
    demo, 
    scoutTest,
    scout,
    jobInterviewConfig,
    job,
    company,
    companyContext
  } = useBotContext();
  
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate room name and participant name
  const roomName = `interview-${Date.now()}`;
  const participantName = application?.id ? `applicant-${application.id}` : `user-${Date.now()}`;

  // Fetch token for room access
  const fetchToken = useCallback(async () => {
    try {
      // Create context data to send to backend
      const contextData = {
        scout_name: scout.name,
        scout_role: scout.role,
        scout_prompt: scout.prompt,
        scout_emotion: scout.emotion,
        company_name: company.name,
        company_description: companyContext.description,
        company_culture: companyContext.culture,
        interview_questions: jobInterviewConfig?.interview_questions,
        interview_context: {
          company_info: {
            name: company.name,
            industry: company.industry || 'Technology',
            description: companyContext.description,
            culture: companyContext.culture,
            history: companyContext.history,
          },
          job_info: job ? {
            // Use safe property access based on the actual job type
            id: job.id,
            company_id: job.company_id,
            // Add any additional job fields that definitely exist
          } : null
        }
      };

      const resp = await fetch('/api/bot/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomName, 
          participantName,
          contextData
        }),
      });
      
      const data = await resp.json();
      if (!resp.ok || !data.token) {
        throw new Error(data.error || 'Failed to fetch token');
      }
      setToken(data.token);
    } catch (e) {
      console.error('Error fetching token:', e);
      setError(e instanceof Error ? e.message : 'Failed to connect');
    }
  }, [roomName, participantName, scout, jobInterviewConfig, job, company, companyContext]);

  // Handle room disconnection
  const handleDisconnect = useCallback(() => {
    setToken(null);
    if (demo) {
      router.push('/');
    } else if (scoutTest) {
      router.push('/jobs');
    } else {
      router.push('/assessment/conclusion');
    }
  }, [demo, scoutTest, router]);

  // Error display
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center relative">
        <div className="absolute right-4 z-50">
          <Toast className="bg-destructive text-destructive-foreground">{error}</Toast>
        </div>
        <Alert className="max-w-md border border-destructive text-destructive-foreground">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no token, show device setup
  if (!token) {
    return <Configure onReady={fetchToken} />;
  }

  // Connected state with LiveKit room
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!livekitUrl) {
    setError("LiveKit URL is not configured.");
    return null;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      onDisconnected={handleDisconnect}
      onError={(e) => {
        console.error("LiveKit Error:", e);
        setError("Connection error. Please try again.");
      }}
      className="flex flex-col h-screen"
    >
      <VideoInterviewSession onLeave={handleDisconnect} />
    </LiveKitRoom>
  );
}
