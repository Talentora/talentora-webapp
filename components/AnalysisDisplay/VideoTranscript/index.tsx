import VideoPlayer from './VideoPlayer'
import { InterviewSummary } from './TranscriptSummary'
import { TranscriptViewer } from './TranscriptScroller'
import { AISummaryApplicant } from "@/types/analysis";
import { useState, useEffect } from "react";
import { portalProps } from "@/app/(pages)/applicants/[id]/page";

interface VideoTranscriptProps {
    aiSummary: portalProps['AI_summary'] | null;
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
  const typedSummary = aiSummary as AISummaryApplicant;
  const transcriptSumamry = typedSummary.transcript_summary;
  const transcriptId = typedSummary.batch_processor_transcript_id;

  const [transcript, setTranscript] = useState<{speaker: string, text: string}[]>([]);
  const recordingId = typedSummary?.recording_id;
  const [recording, setRecording] = useState<Recording | null>(null);

  useEffect(() => {
    const getRecording = async () => {
      try {
        const response = await fetch(`/api/bot/recordings/${recordingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transcript');
        }
        const data = await response.json();
        setRecording(data);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    };

    const getTranscript = async () => {
      try {
        const response = await fetch(`/api/bot/transcripts/${transcriptId}`);
        const data = await response.text();
        
        // Parse the transcript text into structured format
        const lines = data.split('\n').filter(line => line.trim());
        const parsedTranscript = lines.map(line => {
          const [speaker, ...textParts] = line.split(':');
          const text = textParts.join(':').trim();
          
          return { speaker, text };
        });

        setTranscript(parsedTranscript as {speaker: string, text: string}[]);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    };

    if (recordingId) {
      getRecording();
    }
    if (transcriptId) {
      getTranscript();
    }
  }, [aiSummary, recordingId, transcriptId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Rewatch the Interview</h1>
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <VideoPlayer recording={recording} />
        </div>
        <div className="flex flex-row flex-1 gap-4">
          <div className="flex-1">
            <InterviewSummary summary={transcriptSumamry || ""} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Interview Transcript</h2>
            <TranscriptViewer transcript={transcript} />
          </div>
        </div>
      </div>
    </div>
  )
}
