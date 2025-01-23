import VideoPlayer from './VideoPlayer'
import { InterviewSummary } from './TranscriptSummary'
import { TranscriptViewer } from './TranscriptScroller'
import { AISummaryApplicant } from "@/types/analysis";
import { useState, useEffect } from "react";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Skeleton } from "@/components/ui/skeleton";

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

export const VideoTranscriptSkeleton = () => (
    <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Rewatch the Interview</h1>
        <div className="flex flex-col gap-4">
            <div className="flex-1">
                <Skeleton className="w-full aspect-video rounded-lg" />
            </div>
            <div className="flex flex-row flex-1 gap-4">
                <div className="flex-1">
                    <Skeleton className="h-[300px] w-full" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4">Interview Transcript</h2>
                    <Skeleton className="h-[300px] w-full" />
                </div>
            </div>
        </div>
    </div>
);

export default function VideoTranscript({ aiSummary }: VideoTranscriptProps) {
  const typedSummary = aiSummary as AISummaryApplicant;
  const transcriptSumamry = typedSummary.transcript_summary;
  const transcriptId = typedSummary["batch-processor_transcript_id"];

  const [isLoading, setIsLoading] = useState(true);
  const [transcript, setTranscript] = useState<{speaker: string, text: string}[]>([]);
  const recordingId = typedSummary?.recording_id;
  const [recording, setRecording] = useState<Recording | null>(null);
  console.log("transcript", transcript)

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
        try {
            if (recordingId) {
                await getRecording();
            }
            if (transcriptId) {
                await getTranscript();
            }
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [aiSummary, recordingId, transcriptId]);

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
      const response = await fetch(`/api/bot/transcription/${transcriptId}`, {
        headers: {
          'x-transcript-format': 'txt'
        }
      });
      const data = await response.text();
      
      // Parse the transcript text into structured format
      // Split on "Speaker" to handle multi-line text properly
      const segments = data.split(/(?=Speaker \d+:)/).filter(segment => segment.trim());
      
      const parsedTranscript = segments.map(segment => {
        // Extract speaker and remaining text
        const speakerMatch = segment.match(/^Speaker (\d+):/);
        if (!speakerMatch) return null;
        
        // Remove speaker prefix and trim the text
        const text = segment.replace(/^Speaker \d+:/, '').trim();
        
        return {
          speaker: `Speaker ${speakerMatch[1]}`,
          text
        };
      }).filter(entry => entry !== null);

      setTranscript(parsedTranscript as {speaker: string, text: string}[]);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  if (isLoading) {
    return <VideoTranscriptSkeleton />;
  }

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
            <h2 className="text-2xl font-semibold">Interview Transcript</h2>
            <TranscriptViewer transcript={transcript} />
          </div>
        </div>
      </div>
    </div>
  )
}
