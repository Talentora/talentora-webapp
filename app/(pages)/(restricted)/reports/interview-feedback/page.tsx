"use client";

import { InterviewFeedbackComponent } from "../components/InterviewFeedback";
import { interviewFeedback } from "../data/interview-feedback";

export default function InterviewFeedbackPage() {
  return <InterviewFeedbackComponent feedback={interviewFeedback} />;
} 