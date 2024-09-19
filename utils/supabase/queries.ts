import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';


type User = Tables<'users'>;
type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type UserDetails = Tables<'users'>;
type Job = Tables<'jobs'>;

// const supabase  = createClient();

export const getUser = cache(async (
  supabase : SupabaseClient
) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (
  supabase : SupabaseClient

) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (
  supabase : SupabaseClient

) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (
  supabase : SupabaseClient

) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getJobs = cache(
  async (
    supabase : SupabaseClient

  ): Promise<Job[]> => {
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
  }
);

export const getJob = cache(
  async (
    supabase : SupabaseClient,
    id: number
  
  
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
  }
);

export const updateJob = async (id: string, jobData: { title: string; description: string }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }

  return data;
};

export const getApplicants = cache(
  async (
    supabase : SupabaseClient,    
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
  }
);
