import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';

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

export const getJobs = cache(async (supabase:SupabaseClient): Promise<Job[]> => {

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*');

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return jobs || [];
});