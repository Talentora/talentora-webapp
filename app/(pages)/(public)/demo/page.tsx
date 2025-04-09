'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Bot from '@/components/Bot';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Application = Tables<'applications'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type ScoutConfig = Tables<'bots'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type CompanyContext = Tables<'company_context'>;

type ScoutProps = {
  scout: any;
  jobInterviewConfig: any;
  companyContext: any;
  job: any;
  company: any;
  mergeJob: any;
  application: any;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
};

// Default interview duration in seconds
const DEFAULT_INTERVIEW_DURATION = 60 * 5; // 5 minutes

// Demo interview options with different contexts
const DEMO_INTERVIEWS = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Technical interview for a full-stack software engineering position',
    company: {
      name: 'TechCorp',
      industry: 'Technology',
      description: 'A leading technology company focused on cloud solutions and enterprise software.'
    },
    job: {
      title: 'Senior Software Engineer',
      description: 'Design and implement scalable backend systems using modern technologies.',
      requirements: 'Experience with Node.js, React, and cloud infrastructure.',
      level: 'Senior',
      department: 'Engineering'
    },
    interviewer: {
      name: 'Alex',
      role: 'Technical Recruiter',
      style: 'Technical and detail-oriented',
      emotion: {
        curiosity: 0.8,
        positivity: 0.6,
        surprise: 0.3,
        speed: 0.5
      }
    }
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Product strategy and leadership interview',
    company: {
      name: 'ProductSphere',
      industry: 'Software Products',
      description: 'A product-led company focused on user experience and innovative solutions.'
    },
    job: {
      title: 'Senior Product Manager',
      description: 'Lead product strategy and execution for our flagship SaaS platform.',
      requirements: 'Experience in product management, user research, and agile methodologies.',
      level: 'Senior',
      department: 'Product'
    },
    interviewer: {
      name: 'Jamie',
      role: 'Director of Product',
      style: 'Strategic and visionary',
      emotion: {
        positivity: 0.7,
        curiosity: 0.9,
        speed: 0.4,
        surprise: 0.2
      }
    }
  },
  {
    id: 'marketing-specialist',
    title: 'Marketing Specialist',
    description: 'Interview for a digital marketing role',
    company: {
      name: 'GrowthGenius',
      industry: 'Marketing',
      description: 'A fast-growing digital marketing agency helping clients expand their online presence.'
    },
    job: {
      title: 'Digital Marketing Specialist',
      description: 'Create and execute digital marketing campaigns across multiple channels.',
      requirements: 'Experience with SEO, content marketing, and social media strategies.',
      level: 'Mid-level',
      department: 'Marketing'
    },
    interviewer: {
      name: 'Taylor',
      role: 'Marketing Team Lead',
      style: 'Creative and results-driven',
      emotion: {
        positivity: 0.9,
        curiosity: 0.7,
        speed: 0.6,
        surprise: 0.2
      }
    }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Technical interview for a data science position',
    company: {
      name: 'DataDynamics',
      industry: 'Analytics',
      description: 'An innovative company specializing in AI and machine learning solutions.'
    },
    job: {
      title: 'Senior Data Scientist',
      description: 'Develop and implement machine learning models and data analytics solutions.',
      requirements: 'Experience with Python, ML frameworks, and statistical analysis.',
      level: 'Senior',
      department: 'Data Science'
    },
    interviewer: {
      name: 'Sarah',
      role: 'Lead Data Scientist',
      style: 'Analytical and methodical',
      emotion: {
        curiosity: 0.9,
        positivity: 0.7,
        speed: 0.4,
        surprise: 0.3
      }
    }
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    description: 'Design-focused interview for a UX position',
    company: {
      name: 'DesignFlow',
      industry: 'Design',
      description: 'A design-first company creating exceptional user experiences.'
    },
    job: {
      title: 'Senior UX Designer',
      description: 'Create intuitive and engaging user experiences for digital products.',
      requirements: 'Experience with user research, wireframing, and prototyping.',
      level: 'Senior',
      department: 'Design'
    },
    interviewer: {
      name: 'Maya',
      role: 'Design Director',
      style: 'Creative and user-focused',
      emotion: {
        positivity: 0.8,
        curiosity: 0.8,
        speed: 0.5,
        surprise: 0.4
      }
    }
  },
  {
    id: 'sales-manager',
    title: 'Sales Manager',
    description: 'Leadership interview for a sales position',
    company: {
      name: 'SalesForce Pro',
      industry: 'Sales',
      description: 'A leading sales enablement and consulting firm.'
    },
    job: {
      title: 'Regional Sales Manager',
      description: 'Lead and grow sales team while developing key client relationships.',
      requirements: 'Experience in B2B sales, team management, and revenue growth.',
      level: 'Senior',
      department: 'Sales'
    },
    interviewer: {
      name: 'Michael',
      role: 'VP of Sales',
      style: 'Results-oriented and motivational',
      emotion: {
        positivity: 0.9,
        curiosity: 0.6,
        speed: 0.7,
        surprise: 0.2
      }
    }
  }
];

export default function DemoPage() {
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [scoutProps, setScoutProps] = useState<ScoutProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to prepare the interview context based on the selected option
  const prepareInterviewContext = (interviewId: string) => {
    setIsLoading(true);
    
    const selectedOption = DEMO_INTERVIEWS.find(option => option.id === interviewId);
    if (!selectedOption) {
      setIsLoading(false);
      return;
    }

    // Create the necessary context objects for the Bot component
    const context: ScoutProps = {
      scout: {
        id: Date.now(),
        company_id: 'demo-company',
        name: selectedOption.interviewer.name,
        role: selectedOption.interviewer.role,
        description: `${selectedOption.interviewer.name} is a ${selectedOption.interviewer.role} at ${selectedOption.company.name}`,
        prompt: `Act as a ${selectedOption.interviewer.style} interviewer for a ${selectedOption.job.title} position.`,
        emotion: selectedOption.interviewer.emotion,
        icon: null,
        voice: {
          id: '79a125e8-cd45-4c13-8a67-188112f4dd22',
          name: 'Friendly Sidekick',
          gender: 'masculine',
          language: 'en',
          is_public: true,
          api_status: 'unlocked',
          embedding: [] // Simplified for demo
        },
        created_at: new Date().toISOString()
      },
      jobInterviewConfig: {
        interview_questions: `Tell me about your experience related to ${selectedOption.job.title}. What makes you a good fit for this role?`,
        sample_response: 'A good answer would demonstrate relevant experience and skills that match our requirements.',
        duration: DEFAULT_INTERVIEW_DURATION
      },
      company: {
        id: 'demo-company',
        name: selectedOption.company.name,
        industry: selectedOption.company.industry,
        description: selectedOption.company.description,
        company_context: 'demo-context',
        email_extension: null,
        website_url: null,
        location: null,
        billing_address: null,
        payment_method: null,
        subscription_id: null,
        merge_account_token: null
      },
      companyContext: {
        id: 'demo-context',
        description: selectedOption.company.description,
        culture: `${selectedOption.company.name} has a collaborative and innovative culture.`,
        history: `${selectedOption.company.name} was founded as a leader in the ${selectedOption.company.industry} industry.`,
        products: `${selectedOption.company.name} offers cutting-edge solutions in ${selectedOption.company.industry}.`,
        customers: `${selectedOption.company.name} serves clients ranging from startups to enterprise organizations.`,
        goals: `${selectedOption.company.name} aims to revolutionize the ${selectedOption.company.industry} space.`,
        created_at: new Date().toISOString()
      },
      job: {
        id: 'demo-job',
        company_id: 'demo-company',
        title: selectedOption.job.title,
        description: selectedOption.job.description,
        requirements: selectedOption.job.requirements,
        level: selectedOption.job.level,
        department: selectedOption.job.department,
        merge_id: 'demo-merge'
      },
      mergeJob: null,
      application: null,
      enableRecording: false,
      demo: true,
      scoutTest: false
    };

    setScoutProps(context);
    setSelectedInterview(interviewId);
    setIsLoading(false);
  };

  // Return to selection screen
  const handleBackToSelection = () => {
    setSelectedInterview(null);
    setScoutProps(null);
  };

  return (
    <div className="container mx-auto py-8">
      {!selectedInterview ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Demo Interview Experience</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select an interview type to practice and improve your interviewing skills. 
              Our AI interviewers will adapt to different roles and company contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_INTERVIEWS.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg p-5 transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{interview.title}</CardTitle>
                  <CardDescription>{interview.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Company:</span> {interview.company.name}</p>
                    <p><span className="font-semibold">Position:</span> {interview.job.title}</p>
                    <p><span className="font-semibold">Interviewer:</span> {interview.interviewer.name}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => prepareInterviewContext(interview.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Preparing Interview...' : 'Start Interview'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col min-h-screen">
          {!isLoading && scoutProps ? (
            <>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToSelection}
                  className="mb-4"
                >
                  ← Back to Selection
                </Button>
              </div>
              <Bot {...scoutProps} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <div className="animate-fade-in">
                <p className="text-xl font-medium text-primary-700 text-center animate-pulse">
                  {
                    [
                      'Warming up the interview bot...',
                      'Practicing firm handshakes...',
                      'Ironing the virtual suit...',
                      'Rehearsing professional small talk...',
                      'Brewing coffee for the interviewer...',
                      'Polishing tough questions...',
                      'Adjusting the virtual tie...',
                      'Setting up the perfect lighting...'
                    ][Math.floor((Date.now() / 2000) % 8)]
                  }
                </p>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Please wait while we prepare your interview
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
