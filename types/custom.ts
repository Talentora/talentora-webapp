import { Tables } from './types_db';

export interface BotWithJobs extends Tables<'bots'> {
  job_interview_config?: {
    job_id: string;
    bot_id: number;
  }[];
} 