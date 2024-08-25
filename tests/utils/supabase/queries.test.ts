import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { getJobs } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

describe('getJobs', () => {
  let supabase: SupabaseClient;

  beforeAll(() => {
    supabase = createClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of jobs when data is available', async () => {
    const jobs: Job[] = [{ id: 1, title: 'Job 1', applicant_count: null, company_id: null, description: null, salary_range: null }];
    jest.spyOn(supabase.from('jobs'), 'select').mockResolvedValue({ data: jobs, error: null });
    const result = await getJobs(supabase);
    expect(result).toEqual(jobs);
  });

  it('should return an empty array when no jobs are found', async () => {
    jest.spyOn(supabase.from('jobs'), 'select').mockResolvedValue({ data: [], error: null });
    const result = await getJobs(supabase);
    expect(result).toEqual([]);
  });

  it('should handle errors correctly and return an empty array', async () => {
    const error = new Error('Error fetching jobs');
    jest.spyOn(supabase.from('jobs'), 'select').mockResolvedValue({ data: null, error });
    const result = await getJobs(supabase);
    expect(result).toEqual([]);
  });
});