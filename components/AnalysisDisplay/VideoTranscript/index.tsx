'use client'
import VideoPlayer from './VideoPlayer'
import { InterviewSummary } from './TranscriptSummary'
import { TranscriptViewer } from './TranscriptScroller'
import { AISummaryApplicant } from "@/types/analysis";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from 'react';
interface VideoTranscriptProps {
    portalProps: portalProps;
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

const VideoTranscript = ({ portalProps }: VideoTranscriptProps) => {
    const { AI_summary: aiSummary } = portalProps;
    const typedSummary = aiSummary as AISummaryApplicant;
    const transcriptSummary = typedSummary?.transcript_summary;
    const transcriptId = typedSummary?.["batch-processor_transcript_id"]
    const recordingId = typedSummary?.recording_id;

    // Fetch recording data
    const [recording, setRecording] = useState(null);
    const [isRecordingLoading, setIsRecordingLoading] = useState(false);

    useEffect(() => {
        const fetchRecording = async () => {
            setIsRecordingLoading(true);
            if (!recordingId) {
                setRecording(null);
                setIsRecordingLoading(false);
                return;
            }
            try {
                const response = await fetch(`/api/bot/recordings/${recordingId}`);
                if (!response.ok) throw new Error('Failed to fetch recording');
                const data = await response.json();
                setRecording(data);
            } catch (error) {
                console.error('Error fetching recording:', error);
            } finally {
                setIsRecordingLoading(false);
            }
        };

        fetchRecording();
    }, [recordingId]);

    // Fetch and parse transcript data
    const [transcript, setTranscript] = useState<{ speaker: string; text: string; }[] | null>(null);
    const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

    useEffect(() => {
        const fetchTranscript = async () => {
            setIsTranscriptLoading(true);
            if (!transcriptId) {
                setTranscript(null);
                setIsTranscriptLoading(false);
                return;
            }
            try {
                const response = await fetch(`/api/bot/transcription/${transcriptId}`, {
                    headers: {
                        'x-transcript-format': 'txt'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch transcript');
                const data = await response.text();

                // Parse the transcript text into structured format
                const segments = data.split(/(?=Speaker \d+:)/).filter(segment => segment.trim());
                
                const parsedTranscript = segments.map(segment => {
                    const speakerMatch = segment.match(/^Speaker (\d+):/);
                    if (!speakerMatch) return null;
                    
                    const text = segment.replace(/^Speaker \d+:/, '').trim();
                    return {
                        speaker: `Speaker ${speakerMatch[1]}`,
                        text
                    };
                }).filter((entry): entry is {speaker: string, text: string} => entry !== null);

                setTranscript(parsedTranscript);
            } catch (error) {
                console.error('Error fetching transcript:', error);
            } finally {
                setIsTranscriptLoading(false);
            }
        };

        fetchTranscript();
    }, [transcriptId]);

    const isLoading = isRecordingLoading || isTranscriptLoading;

    if (isLoading) {
        return <VideoTranscriptSkeleton />;
    }

    if (!recording || !transcript) {
        return (
            <div className="container mx-auto py-8">
                {/* <p>{JSON.stringify(aiSummary[0])}</p> */}
                <h1 className="text-3xl font-bold mb-8">Rewatch the Interview</h1>
                <div className="text-center text-gray-500">
                    No interview recording or transcript found.
                </div>
            </div>
        );
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
                        <InterviewSummary summary={transcriptSummary || ""} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold">Interview Transcript</h2>
                        <TranscriptViewer transcript={transcript} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoTranscript;
