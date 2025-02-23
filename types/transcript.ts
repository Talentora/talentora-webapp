import { TranscriptData } from '@pipecat-ai/client-js';

export interface InterviewTranscriptEntry extends TranscriptData {
  role: 'bot' | 'user';
  timestamp: string;
}

export type InterviewTranscript = InterviewTranscriptEntry[]; 