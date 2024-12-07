import VideoPlayer from './VideoPlayer'
import { InterviewSummary } from './TranscriptSummary'
import { TranscriptViewer } from './TranscriptScroller'
import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { useState, useEffect } from "react";
// Mock data for demonstration
const mockSummary = "The candidate demonstrated strong problem-solving skills and excellent communication. They have a solid understanding of web development technologies and showed enthusiasm for learning new skills."

const mockTranscript = [
  { speaker: "AI Interviewer", text: "Hello! Can you tell me about your experience with React?" },
  { speaker: "Candidate", text: "I've been working with React for about 3 years now. I've built several large-scale applications using React, Redux for state management, and various testing frameworks like Jest and React Testing Library." },
  { speaker: "AI Interviewer", text: "That's great! Can you describe a challenging problem you've solved using React?" },
  { speaker: "Candidate", text: "One challenging problem I faced was optimizing the performance of a complex dashboard with real-time data updates..." },
  // Add more entries as needed
]

interface VideoTranscriptProps {
    aiSummary: AI_summary_applicant | null;
}

export interface Recording {
  id: string
  room_name: string
  start_ts: number
  status: string
  duration: number
  share_token: string
  tracks: any[]
  s3key: string
  mtgSessionId: string
  isVttEnabled: boolean
}

export default function VideoTranscript({ aiSummary }: VideoTranscriptProps) {
  const summary: string = (aiSummary?.interview_summary as any)?.content || "Missing Summary"

const [recording, setRecording] = useState<Recording | null>(null)
useEffect(() => {
  const getRecording = async () => {
    try {
      const response = await fetch(`/api/bot/recordings/${aiSummary.recording_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }
      const data = await response.json();
      // Assuming the API returns a list of transcript entries
      setRecording(data);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  getRecording();
}, [aiSummary])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Rewatch the Interview</h1>
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <VideoPlayer recording={recording} />
        </div>
        <div className="flex flex-row flex-1 gap-4">
          <div className="flex-1">
            <InterviewSummary summary={summary} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Interview Transcript</h2>
            <TranscriptViewer transcript={mockTranscript} />
          </div>
        </div>
      </div>
    </div>
  )
}

