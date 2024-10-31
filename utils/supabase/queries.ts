'use server';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';
type Recruiter = Tables<'recruiters'>;
type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
import { useUser } from '@/hooks/useUser';
import { useCompany } from '@/hooks/useCompany';

// CRUD operations for the company table

/**
 * Fetches a company by its ID.
 *
 * @param companyId - The ID of the company to fetch.
 * @returns The company data or null if not found.
 */
export const getCompany = async (
  companyId: string
): Promise<Company | null> => {
  try {
    const supabase = createClient();
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
  companyData: any,
  userId: string
  // userId: string
): Promise<Company> => {
  const supabase = createClient();

  // const { user, ...restCompanyData } = companyData;

  // Insert the company
  const { data: createdCompany, error: companyError } = await supabase
    .from('companies')
    .insert(companyData)
    .select()
    .single();

  if (companyError) {
    throw new Error(`Failed to create company: ${companyError.message}`);
  }

  if (!createdCompany) {
    throw new Error('Failed to create company: No data returned');
  }

  if (!userId) {
    throw new Error('No user found');
  }

  // Update the recruiter's company
  const { error: recruiterError } = await supabase
    .from('recruiters')
    .update({ company_id: createdCompany.id })
    .eq('id', userId);

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
  id: string,
  companyData: any
): Promise<Company | null> => {
  const supabase = createClient();
  // Filter out undefined/null values from companyData
  const filteredCompanyData = Object.fromEntries(
    Object.entries(companyData).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('companies')
    .update(filteredCompanyData)
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

export const getUser = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
};

export const getSubscription = async () => {
  const supabase = createClient();
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
};

export const getProducts = async () => {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
};

export async function inviteUser(name: string | null, email: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'recruiter', // You can change this to the appropriate role
        full_name: name || undefined
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
  // supabase: SupabaseClient,
  id: string
): Promise<Recruiter | null> => {
  try {
    const supabase = createClient();
    const { data: recruiter, error } = await supabase
      .from('recruiters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recruiter:', error.message);
      return null;
    }

    if (!recruiter) {
      console.warn(`No recruiter found with ID: ${id}`);
      return null;
    }

    return recruiter; // Ensure this is a plain object
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
export const getMergeApiKey = async (): Promise<string | null> => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error('User not found');
    }

    const recruiter = await getRecruiter(user.id);
    if (!recruiter) {
      throw new Error('Recruiter not found');
    }
    if (!recruiter.company_id) {
      throw new Error('Recruiter company ID not found');
    } else {
      const company = await getCompany(recruiter.company_id);
      if (!company) {
        throw new Error('Company not found');
      }
      return company.merge_api_key;
    }
  } catch (error) {
    console.error('Error fetching Greenhouse API key:', error);
    throw error;
  }
};
