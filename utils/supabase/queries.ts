'use server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';

type User = Tables<'users'>;
type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type UserDetails = Tables<'users'>;
type Job = Tables<'jobs'>;

// const supabase  = createClient();

export const getUser = async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
};

export const getSubscription = async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
};

export const getProducts = async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
};

export const getUserDetails = async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
};

export const getJobs = async (supabase: SupabaseClient): Promise<Job[]> => {
  try {
    const { data: jobs, error } = await supabase.from('jobs').select('*');

    if (error) {
      console.error('Error fetching jobs:', error);
    }
    return jobs || [];
  } catch (err) {
    console.error('Unexpected error fetching jobs:', err);
    return [];
  }
};

/**
 * Creates a new job in the database.
 *
 * @param jobData - The data for the new job.
 * @returns The created job data.
 * @throws Error if the creation operation fails.
 */
export const createJob = async (jobData: Omit<Job, 'id'>): Promise<Job> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
};

/*
 * @returns A boolean indicating whether the deletion was successful.
 * @throws Error if the deletion operation fails.
 */

export const deleteJob = async (id: number): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('jobs').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete job:', error.message); // Log the error message for debugging
    return false;
  }

  console.log('Job deleted successfully'); // Add success log to confirm deletion
  return true;
};

export const getJob = async (
  supabase: SupabaseClient,
  id: string
): Promise<Job | null> => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
    }
    return job || null;
  } catch (err) {
    console.error('Unexpected error fetching job:', err);
    return null;
  }
};

/**
 * Updates a job in the database.
 *
 * @param id - The ID of the job to update.
 * @param jobData - The new data for the job.
 * @returns The updated job data.
 * @throws Error if the update operation fails.
 */
export const updateJob = async (
  id: number,
  jobData: Job
): Promise<Job | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .update({ ...jobData, id: undefined })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }

  return data?.[0] || null;
};

export const getApplicants = async (
  supabase: SupabaseClient,
  jobId: number
) => {
  const { data: applicants, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('job_id', jobId);

  if (error) {
    console.error('Error fetching applicants:', error);
  }

  return applicants || [];
};

export const getCompany = async (
  supabase: SupabaseClient,
  companyId: number
) => {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      return null;
    }

    return company;
  } catch (err) {
    console.error('Unexpected error fetching company:', err);
    return null;
  }
};

export async function inviteUser(email: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      (email = email)
    );
    if (error) {
      console.error('Error inviting user:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Error inviting user:', err);
    return { success: false, error: err };
  }
}
