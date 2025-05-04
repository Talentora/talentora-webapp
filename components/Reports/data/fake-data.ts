// components/Reports/data/fake-data.ts

import { faker } from '@faker-js/faker';

export interface Candidate {
  id?: string;
  first_name: string;
  last_name: string;
  email_addresses?: { email?: string }[];
  title?: string;
  locations: { name: string }[];
  applications?: string[];
  created_at?: string;
  modified_at?: string;
}

export interface Application {
  id: string;
  job_id?: string;
  created_at: string; // ISO date string
  current_stage?: string;
}

export interface EmotionEval {
  explanation: string;
  overall_score: number;
}

export interface TextEval {
  technical: {
    overall_score: number;
    system_design: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    best_practices: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    knowledge_depth: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    problem_solving: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    testing_approach: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
  };
  behavioral: {
    initiative: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    collaboration: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    overall_score: number;
    problem_approach: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    learning_attitude: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
  };
  experience: {
    growth: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    impact: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    overall_score: number;
    technical_breadth: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    project_complexity: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
  };
  communication: {
    clarity: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    articulation: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    overall_score: number;
    professionalism: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
    listening_skills: {
      score: number;
      explanation: string;
      supporting_quotes: string[];
    };
  };
}

export interface AI_Summary {
    emotion_eval: EmotionEval;
    text_eval: TextEval;
    overall_summary: string;
    transcript_summary: string;
    resume_analysis: {
      resumeScore: number;
      technicalScore: number;
      cultureFitScore: number;
      communicationScore: number;
    };
}

export interface ApplicantData {
  candidate: Candidate;
  job?: { 
    id?: string;
    name: string; 
    status: string;
    description?: string;
    code?: string;
  };
  interviewStages?: { 
    id?: string;
    name: string;
    job?: string;
    stage_order?: number;
  };
  application?: Application | null;
  AI_Summary?: AI_Summary | null;
  hasSupabaseData?: boolean;
  hasMergeData?: boolean;
}

// Helper to generate random quotes
const generateQuotes = (count: number) =>
  Array.from({ length: count }, () => faker.lorem.sentence());

// Helper to generate a random score between 1 and 10
const randomScore = () => faker.number.int({ min: 1, max: 10 });

// Only 4-5 unique jobs
const JOBS = [
  { name: "Frontend Engineer", status: "OPEN" },
  { name: "Backend Engineer", status: "OPEN" },
  { name: "Fullstack Developer", status: "CLOSED" },
  { name: "DevOps Engineer", status: "OPEN" },
  { name: "Product Manager", status: "CLOSED" },
];

const generateAISummary = (): AI_Summary => ({
  emotion_eval: {
    explanation: faker.lorem.sentence(),
    overall_score: randomScore(),
  },
  text_eval: {
    technical: {
      overall_score: randomScore(),
      system_design: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      best_practices: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      knowledge_depth: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      problem_solving: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      testing_approach: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
    },
    behavioral: {
      initiative: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      collaboration: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      overall_score: randomScore(),
      problem_approach: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      learning_attitude: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
    },
    experience: {
      growth: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      impact: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      overall_score: randomScore(),
      technical_breadth: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      project_complexity: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
    },
    communication: {
      clarity: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      articulation: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      overall_score: randomScore(),
      professionalism: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
      listening_skills: {
        score: randomScore(),
        explanation: faker.lorem.sentence(),
        supporting_quotes: generateQuotes(2),
      },
    },
  },
  overall_summary: faker.lorem.paragraph(),
  transcript_summary: faker.lorem.paragraph(),
  resume_analysis: {
    resumeScore: faker.number.int({ min: 1, max: 10 }),
    technicalScore: faker.number.int({ min: 1, max: 10 }),
    cultureFitScore: faker.number.int({ min: 1, max: 10 }),
    communicationScore: faker.number.int({ min: 1, max: 10 }),
  }
});

export const generateFakeData = (num: number): ApplicantData[] => {
  const applicants: ApplicantData[] = [];

  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const locationName = faker.location.city();

    // Pick a job from the fixed list
    const jobObj = JOBS[faker.number.int({ min: 0, max: JOBS.length - 1 })];

    const stageName = faker.helpers.arrayElement([
      'Phone Screen',
      'Technical Interview',
      'Onsite',
      'Offer',
      'Rejected',
    ]);
    const createdAt = faker.date.past().toISOString();
    const appId = faker.string.uuid();

    // Only some applicants have application data
    const hasSupabaseData = faker.datatype.boolean();

    // Only some of those with application have AI_Summary data
    const hasAISummary = hasSupabaseData ? faker.datatype.boolean() : false;

    const application: Application | null = hasSupabaseData
      ? {
          id: appId,
          created_at: createdAt,
        }
      : null;

    // If the applicant has application and hasAISummary, generate AI_Summary, else null
    const AI_Summary: AI_Summary | null = hasSupabaseData && hasAISummary
      ? generateAISummary()
      : null;

    const applicant: ApplicantData = {
      candidate: {
        first_name: firstName,
        last_name: lastName,
        locations: [{ name: locationName }],
      },
      job: {
        name: jobObj.name,
        status: jobObj.status,
      },
      interviewStages: {
        name: stageName,
      },
      application,
      AI_Summary,
      hasSupabaseData, // for status logic
    };
    applicants.push(applicant);
  }

  console.log("applicants",applicants)
  return applicants;
};

// Example usage
// const fakeData = generateFakeData(100);
// console.log(fakeData);
