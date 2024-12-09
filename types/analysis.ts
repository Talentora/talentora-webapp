export interface TextEvaluation {
    explanation: string;
    overall_score: number;
}

export interface EmotionEvaluation {
    timeline?: any;
    averages?: {
        face: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
        prosody: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
        language: {
            emotions: Record<string, number>;
            aggregate_score: number;
        };
    };
}

export interface OverallSummary {
    explanation: string;
    overall_score: number;
}

export interface AISummaryApplicant {
    text_eval?: TextEvaluation | null;
    emotion_eval?: EmotionEvaluation | null;
    overall_summary?: OverallSummary | null;
    transcript_summary?: string | null;
    recording_id?: string | null;
    application_id?: string | null;
    room_name?: string | null;
    created_at?: string;
    id?: string;
    "batch-processor_transcript_id"?: string | null;
}