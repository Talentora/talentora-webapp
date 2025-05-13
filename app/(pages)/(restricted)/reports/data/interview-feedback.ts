interface ScoreSection {
  score: number;
  explanation: string;
  supporting_quotes: string[];
}

export interface TechnicalFeedback {
  overall_score: number;
  knowledge_depth: ScoreSection;
  problem_solving: ScoreSection;
  best_practices: ScoreSection;
  system_design: ScoreSection;
  testing_approach: ScoreSection;
  hiring_recommendation: string;
  key_strengths: string[];
  areas_for_improvement: string[];
}

export interface CommunicationFeedback {
  overall_score: number;
  clarity: ScoreSection;
  articulation: ScoreSection;
  listening_skills: ScoreSection;
  professionalism: ScoreSection;
}

export interface ExperienceFeedback {
  overall_score: number;
  project_complexity: ScoreSection;
  impact: ScoreSection;
  growth: ScoreSection;
  technical_breadth: ScoreSection;
}

export interface BehavioralFeedback {
  overall_score: number;
  problem_approach: ScoreSection;
  collaboration: ScoreSection;
  learning_attitude: ScoreSection;
  initiative: ScoreSection;
}

export interface InterviewFeedback {
  technical: TechnicalFeedback;
  communication: CommunicationFeedback;
  experience: ExperienceFeedback;
  behavioral: BehavioralFeedback;
}