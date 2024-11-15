import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const defaultConfig = {
  interview_config: {
    interviewer_name: 'Sally',
    company: 'Google',
    role: 'Software Engineer III, AI/Machine Learning',
    job_description:
      'This role requires expertise in: Python and machine learning frameworks, Building and deploying ML models, Experience with cloud platforms (GCP preferred), Strong system design and architecture skills, Collaboration with cross-functional teams'
  }
};

export async function POST(request: Request) {
  const interviewConfig = request.headers.get('interview-config')
    ? JSON.parse(request.headers.get('interview-config') as string)
    : defaultConfig;

  try {
    const response = await axios.post(
      'https://talentora-bot-1.fly.dev/',
      interviewConfig,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling the bot API' });
  }
}
