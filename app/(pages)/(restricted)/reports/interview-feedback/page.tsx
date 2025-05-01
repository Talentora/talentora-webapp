"use client";

import { InterviewFeedbackComponent } from "@/components/AnalysisDisplay/InterviewFeedback";
import { interviewFeedback } from "@/components/AnalysisDisplay/InterviewFeedback/interview-feedback";

export default function InterviewFeedbackPage() {
  return <InterviewFeedbackComponent feedback={interviewFeedback} />;
} 