import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Tables } from '@/types/types_db';

type User = Tables<'users'>;
type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type UserDetails = Tables<'users'>;
type Job = Tables<'jobs'>;


export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getJobs = cache(async (supabase: SupabaseClient): Promise<Job[]> => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*');

    if (error) {
      console.error('Error fetching jobs:', error);
    }
    return jobs || [];
  } catch (err) {
    console.error('Unexpected error fetching jobs:', err);
    return [];
  }
});

export const getJob = cache(async (supabase: SupabaseClient, id: string): Promise<Job | null> => {
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
});

export const getApplicants = cache(async (supabase: SupabaseClient, jobId: number) => {
  const { data: applicants, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('job_id', jobId);

  if (error) {
    console.error('Error fetching applicants:', error);
  }

  return applicants || [];
});