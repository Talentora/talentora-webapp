import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { getJobs, updateJob } from '@/utils/supabase/queries';
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
    const jobs: Job[] = [
      {
        id: 1,
        title: 'Job 1',
        applicant_count: null,
        company_id: null,
        description: null,
        salary_range: null,
        department: null,
        location: null,
        qualifications: null,
        requirements: null
      }
    ];
    jest
      .spyOn(supabase.from('jobs'), 'select')
      .mockResolvedValue({ data: jobs, error: null, count: null, status: 200, statusText: 'OK' });
    const result = await getJobs(supabase);
    expect(result).toEqual(jobs);
  });

  it('should return an empty array when no jobs are found', async () => {
    jest
      .spyOn(supabase.from('jobs'), 'select')
      .mockResolvedValue({ data: [], error: null, count: null, status: 200, statusText: 'OK' });
    const result = await getJobs(supabase);
    expect(result).toEqual([]);
  });

  it('should handle errors correctly and return an empty array', async () => {
    const error = { message: 'Error fetching jobs', details: '', hint: '', code: '' };
    jest
      .spyOn(supabase.from('jobs'), 'select')
      .mockResolvedValue({ data: null, error, count: null, status: 500, statusText: 'Internal Server Error' });
    const result = await getJobs(supabase);
    expect(result).toEqual([]);
  });
});

describe('updateJob', () => {
  let supabase: SupabaseClient;

  beforeAll(() => {
    supabase = createClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a job successfully', async () => {
    const jobId = 1;
    const updatedJobData: Partial<Job> = {
      title: 'Updated Job Title',
      description: 'Updated job description',
      salary_range: '$60,000 - $80,000'
    };

    const mockUpdateResponse = {
      data: { ...updatedJobData, id: jobId },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };

    jest
      .spyOn(supabase.from('jobs'), 'update')
      .mockResolvedValue(mockUpdateResponse);

    const result = await updateJob(jobId, updatedJobData as Job);

    expect(result).toEqual(mockUpdateResponse.data);
    expect(supabase.from('jobs').update).toHaveBeenCalledWith({ ...updatedJobData, id: undefined });
    expect(supabase.from('jobs').update().eq).toHaveBeenCalledWith('id', jobId);
  });

  it('should throw an error when update fails', async () => {
    const jobId = 1;
    const updatedJobData: Partial<Job> = {
      title: 'Updated Job Title'
    };

    const mockError = {
      message: 'Failed to update job',
      details: '',
      hint: '',
      code: 'ERROR'
    };

    jest
      .spyOn(supabase.from('jobs'), 'update')
      .mockResolvedValue({ data: null, error: mockError, count: null, status: 500, statusText: 'Internal Server Error' });

    await expect(updateJob(jobId, updatedJobData as Job)).rejects.toThrow('Failed to update job: Failed to update job');
  });
});
