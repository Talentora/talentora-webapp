import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import React from 'react';
import { Maximize2 } from 'lucide-react';

interface AssessmentScoreProps {
  portalProps: portalProps;
}

interface ScoreMeterProps {
  label: string;
  score: number;
  outOf?: number;
}

function ScoreMeter({ label, score, outOf = 100 }: ScoreMeterProps) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const pct = Math.min(Math.max(score / outOf, 0), 1);
  const dashOffset = circumference - pct * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        // className="transform rotate-90"
      >
        {/* background track */}
        <g transform={`rotate(270 ${radius} ${radius})`}>
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* progress ring */}
          <circle
            stroke="url(#scoreGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.35s' }}
          />
        </g>

        <defs>
          <linearGradient id="scoreGradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* center text */}
        <text
          x="50%"
          y="43%"
          className="fill-gray-900 font-semibold text-lg"
          textAnchor="middle"
          dy="0.3em"
        >
          {score}
        </text>
        <text
          x="50%"
          y="60%"
          className="fill-gray-500 text-sm"
          textAnchor="middle"
        >
          out of {outOf}
        </text>
      </svg>
      <span className="mt-4 text-sm font-medium text-gray-900">{label}</span>
    </div>
  );
}

export function ApplicantScores({ portalProps }: AssessmentScoreProps) {
  const { AI_summary } = portalProps;

  if (!AI_summary) {
    return (
      <div className="min-w-max h-full bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-500">
            Candidate assessment scores will appear here.
          </h3>
        </div>
      </div>
    );
  }

  // Extract scores
  let overallScore = 0;
  let textScore = 0;
  let emotionScore = 0;

  try {
    // Parse overall score from JSON string if needed
    if (typeof AI_summary.overall_summary === 'string') {
      try {
        const parsed = JSON.parse(AI_summary.overall_summary);
        overallScore = parsed.score || 0;
      } catch (e) {
        console.error('Error parsing overall_summary JSON:', e);
        overallScore = 0;
      }
    } else if (
      AI_summary.overall_summary &&
      typeof AI_summary.overall_summary === 'object'
    ) {
      overallScore = (AI_summary.overall_summary as any).score || 0;
    }

    // Parse text_eval score
    if (typeof AI_summary.text_eval === 'string') {
      try {
        const parsed = JSON.parse(AI_summary.text_eval);
        textScore = parsed.overall_score || 0;
      } catch (e) {
        console.error('Error parsing text_eval JSON:', e);
        textScore = 0;
      }
    } else if (
      AI_summary.text_eval &&
      typeof AI_summary.text_eval === 'object'
    ) {
      textScore = (AI_summary.text_eval as any).overall_score || 0;
      console.log('here23');
    }

    // Parse emotion_eval score
    if (typeof AI_summary.emotion_eval === 'string') {
      try {
        const parsed = JSON.parse(AI_summary.emotion_eval);
        emotionScore = parsed.overall_score || 0;
      } catch (e) {
        console.error('Error parsing emotion_eval JSON:', e);
        emotionScore = 0;
      }
    } else if (
      AI_summary.emotion_eval &&
      typeof AI_summary.emotion_eval === 'object'
    ) {
      emotionScore = (AI_summary.emotion_eval as any).overall_score || 0;
    }
  } catch (e) {
    console.error('Error extracting scores:', e);
  }

  return (
    <div className="min-w-max bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Assessment Scores
        </h3>
      </div>
      <div className="flex justify-around">
        <ScoreMeter label="Overall" score={overallScore} />
        <ScoreMeter label="Emotional" score={emotionScore} />
        <ScoreMeter label="Lexical" score={textScore} />
      </div>
    </div>
  );
}

export default ApplicantScores;
