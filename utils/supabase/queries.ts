'use server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';
type Recruiter = Tables<'recruiters'>
type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;

// CRUD operations for the company table

/**
 * Fetches a company by its ID.
 *
 * @param supabase - The Supabase client instance.
 * @param companyId - The ID of the company to fetch.
 * @returns The company data or null if not found.
 */
export const getCompany = async (
  supabase: SupabaseClient,
  companyId: string
): Promise<Company | null> => {
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

/**
 * Creates a new company in the database.
 *
 * @param companyData - The data for the new company.
 * @returns The created company data.
 * @throws Error if the creation operation fails.
 */
export const createCompany = async (
  companyData:any,
  // userId: string
): Promise<Company> => {
  const supabase = createClient();

  const { user, ...restCompanyData } = companyData;
   
  // Insert the company
  const { data: createdCompany, error: companyError } = await supabase
    .from('companies')
    .insert(restCompanyData)
    .select()
    .single();

  if (companyError) {
    throw new Error(`Failed to create company: ${companyError.message}`);
  }

  if (!createdCompany) {
    throw new Error('Failed to create company: No data returned');
  }

  if (!user) {
    throw new Error('No user found');
  }

  // Update the recruiter's company
  const { error: recruiterError } = await supabase
    .from('recruiters')
    .update({ company_id: createdCompany.id })
    .eq('id', user?.id);

  if (recruiterError) {
    throw new Error(`Failed to update recruiter: ${recruiterError.message}`);
  }

  return createdCompany;
};

/**
 * Updates a company in the database.
 *
 * @param id - The ID of the company to update.
 * @param companyData - The new data for the company.
 * @returns The updated company data.
 * @throws Error if the update operation fails.
 */
export const updateCompany = async (
  id: number,
  companyData: Company
): Promise<Company | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('companies')
    .update({ ...companyData, id: undefined })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to update company: ${error.message}`);
  }

  return data?.[0] || null;
};

/**
 * Deletes a company from the database.
 *
 * @param id - The ID of the company to delete.
 * @returns A boolean indicating whether the deletion was successful.
 * @throws Error if the deletion operation fails.
 */
export const deleteCompany = async (id: number): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from('companies').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete company:', error.message);
    return false;
  }

  console.log('Company deleted successfully');
  return true;
};

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

export async function inviteUser(name:string,email: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'recruiter', // You can change this to the appropriate role
        full_name: name
      }
    });
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

/**
 * Fetches a recruiter by their ID.
 *
 * @param supabase - The Supabase client instance.
 * @param recruiterId - The ID of the recruiter to fetch.
 * @returns The recruiter data or null if not found.
 */
export const getRecruiter = async (
  supabase: SupabaseClient,
  id: string
): Promise<Recruiter | null> => {
  try {
    const { data: recruiter, error } = await supabase
      .from('recruiters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recruiter:', error);
      return null;
    }

    return recruiter;
  } catch (err) {
    console.error('Unexpected error fetching recruiter:', err);
    return null;
  }
};


/**
 * Fetches the Greenhouse API key for the current user's company.
 * 
 * @returns The Greenhouse API key or null if not found.
 * @throws Error if there's an issue fetching the data.
 */
export const getGreenhouseApiKey = async (): Promise<string | null> => {
  const supabase = createClient();
  try {
    const user = await getUser(supabase);
    if (!user) {
      throw new Error('User not found');
    }

    const recruiter = await getRecruiter(supabase, user.id);
    if (!recruiter) {
      throw new Error('Recruiter not found');
    }

    const company = await getCompany(supabase, recruiter.company_id ?? '');
    if (!company) {
      throw new Error('Company not found');
    }

    return company.greenhouse_api_key;
  } catch (error) {
    console.error('Error fetching Greenhouse API key:', error);
    throw error;
  }
}