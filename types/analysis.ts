export interface TextEvaluation {
    explanation: string;
    overall_score: number;
}

export interface EmotionEvaluation {
    explanation: string;
    overall_score: number;
    // Add timeline if it becomes available in future data
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

export interface ParsedOverallSummary {
    score: number;
    explanation: string;
}

export interface AISummaryApplicant {
    id: string;
    recording_id: string;
    room_name: string;
    batch_processor_transcript_id: string;
    overall_summary: string;
    transcript_summary: string;
    emotion_eval: EmotionEvaluation;
    text_eval: TextEvaluation;
}