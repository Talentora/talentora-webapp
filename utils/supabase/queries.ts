"use server";
import { Database } from '@/types/types_db';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Json = Database['public']['Tables']['AI_summary']['Row']['text_eval'];

import { createClient } from '@/utils/supabase/server';
import { ScoutWithJobs } from '@/types/custom';
type Recruiter = Tables<'recruiters'>;
type Company = Tables<'companies'>;
type scout = Tables<'bots'>;
type AI_Summary = Tables<'AI_summary'>;
import { inviteRecruiterAdmin, listUsersAdmin } from '@/utils/supabase/admin';
import { SupabaseClient } from '@supabase/supabase-js';
import { fetchApplicationMergeId } from '@/server/applications';
import { sendAuthCandidateEmail, sendAuthRecruiterEmail } from '../email_helpers';
import { uuid } from '@supabase/auth-js/dist/module/lib/helpers';


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
    const supabase = await createClient();
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

export const getUserCompanyId = async (): Promise<string | null> => {
  const supabase = await createClient();
  const { data: session, error } = await supabase.auth.getSession();

  const userId = session?.session?.user?.id;
  if (!userId) {
    throw new Error('No user found');
  }
  const { data: recruiter, error: recruiterError } = await supabase
    .from('recruiters')
    .select('company_id')
    .eq('id', userId)
    .single();

  return recruiter?.company_id || null;
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
): Promise<Company> => {
  const supabase = await createClient();

  const { data: userCompanyId, error: userCompanyError } = await supabase
    .from('recruiters')
    .select('company_id')
    .eq('id', userId)
    .single();

  if (userCompanyError) {
    throw new Error(`Failed to get user company: ${userCompanyError.message}`);
  }

  // Set configured to false by default
  const companyDataWithConfig = {
    id: userCompanyId.company_id,
    ...companyData,
    Configured: false,
  };


  // Insert the company
  const { data: createdCompany, error: companyError } = await supabase
    .from('companies')
    .upsert(companyDataWithConfig)
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
  const supabase = await createClient();

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
  const supabase = await createClient();
  const { error } = await supabase.from('companies').delete().eq('id', String(id));

  if (error) {
    console.error('Failed to delete company:', error.message);
    return false;
  }

  return true;
};

export const getUser = async () => {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
};

export const getSubscription = async () => {
  const supabase = await createClient();
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
};

export const getProducts = async () => {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
};

export async function inviteRecruiter(
  name: string,
  email: string,
  role: string
): Promise<{ data?: any; error?: string | null }> {
  try {
    console.log('inviting recruiter', name, email);
    // Check if user already exists in auth.users
    const supabase = await createClient();
    // const { data: existingUser, error: userCheckError } =
    //   await listUsersAdmin();
    // const userExists = existingUser?.users?.some(
    //   (user) => user.email === email
    // );

    // if (userCheckError) {
    //   console.error('Error checking existing user:', userCheckError);
    //   return {
    //     data: null,
    //     error: 'Failed to check if user exists'
    //   };
    // }

    // if (userExists) {
    //   return {
    //     data: null,
    //     error: 'User with this email already exists'
    //   };
    // }

    const user = await getUser();
    const recruiter = await getRecruiter(user?.id ?? '');
    const company = await getCompany(recruiter?.company_id ?? '');
    const recruiterRole = role as Database['public']['Enums']['recruiter_role'];

    if (!company) {
      return {
        data: null,
        error: 'Recruiter does not have a company'
      };
    }

    if (recruiterRole && recruiterRole !== 'admin' && recruiterRole !== 'recruiter' && recruiterRole !== 'viewer') {
      return {
        data: null,
        error: 'Invalid role specified. Must be either "admin", "recruiter", "viewer", or null.'
      };
    }

    // Create a pending recruiter record
    const { error: recruiterError } = await supabase
      .from('recruiters')
      .insert({
        id: crypto.randomUUID(),
        email: email,
        full_name: name,
        company_id: company.id,
        status: 'pending_invite',
        role: recruiterRole
      });
    
    console.log('recruiterError', recruiterError);
    if (recruiterError) {
      console.error('Error creating pending recruiter:', recruiterError);
      return {
        data: null,
        error: 'Failed to create pending recruiter record'
      };
    }

    // Send authentication email
    const emailSend = await sendAuthRecruiterEmail(email, company.id, company.name);

    if (!emailSend) {
      return {
        data: null,
        error: 'Failed to send invitation email'
      };
    }

    return {
      data: { success: true },
      error: null
    };
  } catch (error) {
    console.error('Error inviting recruiter:', error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : 'Failed to invite recruiter'
    };
  }
}

export async function inviteCandidate(
  name: string,
  email: string,
  job_id: string,
  merge_candidate_id: string
): Promise<{ data?: any; error?: string | null }> {

  try {
    const supabase = await createClient();
    
    // First, get the job information including company_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('company_id')
      .eq('merge_id', job_id)
      .single();
    
    if (jobError || !jobData || !jobData.company_id) {
      console.error('Error fetching job:', jobError);
      return { data: null, error: 'Failed to find job information' };
    }
    
    // Now fetch the company name using the company_id
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name')
      .eq('id', jobData.company_id)
      .single();
    
    if (companyError || !companyData) {
      console.error('Error fetching company:', companyError);
      return { data: null, error: 'Failed to find company information' };
    }
    
    const companyName = companyData.name;
    // merge application id
    const application_id = await fetchApplicationMergeId(job_id, merge_candidate_id);
    
    // Send authentication email with both signup and signin links
    const emailSend = await sendAuthCandidateEmail(email, merge_candidate_id, companyName, application_id);

    if (!emailSend || !companyName) {
      return { data: null, error: "Failed to send email" };
    }

   
    // Check if application already exists
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .upsert({
        merge_application_id: application_id,
        applicant_id: null,
        job_id: job_id,
        status: 'pending_interview'
      })
      
    if (checkError) {
      console.error('Error checking application:', checkError);
      return { data: null, error: checkError.message };
    }

    if (existingApplication) {
      // Application already exists, return it
      return { data: existingApplication, error: null };
    }
    return { data: null, error: null };

  } catch (error) {
    console.error('Error inviting candidate:', error);
    return { data: null, error: 'Failed to invite candidate' };
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
    const supabase = await createClient();
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
 * Fetches a recruiter by their ID.
 *
 * @param supabase - The Supabase client instance.
 * @returns The recruiter data or null if not found.
 */
export const getRecruiters = async (): Promise<Recruiter[]> => {
  try {
    const supabase = await createClient();
    const { data: recruiters, error } = await supabase
      .from('recruiters')
      .select('*');

    if (error) {
      console.error('Error fetching recruiters:', error.message);
      return [];
    }

    if (!recruiters) {
      console.warn('No recruiters found');
      return [];
    }

    return recruiters;
  } catch (err) {
    console.error('Unexpected error fetching recruiters:', err);
    return [];
  }
};

/**
 * Fetches the Merge API key for the current user's company.
 *
 * @returns The Merge API key or null if not found.
 * @throws Error if there's an issue fetching the data.
 */
export const getMergeApiKey = async (): Promise<string | null> => {
  try {
    const user = await getUser(); 

    if (!user || user.user_metadata?.role === 'applicant') {
      console.log("User not found")
      return null;
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
      return company.merge_account_token;
    }
  } catch (error) {
    console.error('Error fetching Merge API key:', error);
    throw error;
  }
};

/**
 * Fetches a job by its merge_id along with the associated company's merge_account_token.
 *
 * @param jobId - The merge_id of the job to fetch.
 * @returns An object containing job and company data, including the merge_account_token.
 * @throws Error if there's an issue fetching the data.
 */
export const fetchJobTokenById = async (jobId: string): Promise<{ 
  accountToken: string | null;
}> => {
  try {
    const supabase = await createClient();
    
    // First fetch the job to get the company_id
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('merge_id', jobId)
      .single();
    
    if (jobError) {
      console.error('Error fetching job:', jobError);
      throw new Error(`Job not found with ID: ${jobId}`);
    }
    
    if (!job.company_id) {
      throw new Error(`Job with ID ${jobId} has no associated company`);
    }
    
    // Then fetch the company using company_id
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', job.company_id)
      .single();
      
    if (companyError) {
      console.error('Error fetching company:', companyError);
      throw new Error(`Company not found for job ${jobId}`);
    }
    
    return {accountToken: company?.merge_account_token}
    
  } catch (error) {
    console.error('Error in fetchJobById:', error);
    throw error;
  }
};

/**
 * Creates a new scout in the database.
 *
 * @param scoutData - The data for the new scout.
 * @returns The created scout data.
 * @throws Error if the creation operation fails.
 */
export const createscout = async (scoutData: any): Promise<Tables<'bots'>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bots')
    .insert(scoutData)
    .select()
    .single();

  if (error) {
    console.error('Failed to create scout:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from scout creation');
  }

  return data;
};

export async function getUserRole(supabase: SupabaseClient, user_id: string) {
  // Query the recruiters table to check if the user's id exists.
  const { data: recruiterData, error: recruiterError } = await supabase
    .from('recruiters')
    .select('id')
    .eq('id', user_id)
    .single();
  if (recruiterData && !recruiterError) {
      return 'recruiter'
  } else {
      return 'applicant'
  }
}


/**
 * Deletes a scout from the database.
 *
 * @param id - The ID of the scout to delete.
 * @throws Error if the deletion operation fails.
 */
export const deletescout = async (id: number) => {
  const supabase = await createClient();

  // Delete the scout
  const { error: scoutError } = await supabase.from('bots').delete().eq('id', id);

  if (scoutError) {
    throw new Error(`Failed to delete scout: ${scoutError.message}`);
  }
};

/**
 * Fetches all scouts from the database.
 *
 * @returns An array of scout data.
 * @throws Error if the fetch operation fails.
 */
export const getScouts = async (): Promise<ScoutWithJobs[] | null> => {
  try {
    const scoutsWithJobIds = await getScoutsWithJobIds();

    return scoutsWithJobIds;

  } catch (error) {
    console.error('Failed to fetch scouts:', error);
    return null;
  }
};

/**
 * Fetches a scout by ID from the database.
 *
 * @param id - The ID of the scout to fetch.
 * @returns The scout data or null if not found.
 * @throws Error if the fetch operation fails.
 */
export const getscoutById = async (id: string): Promise<scout | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    throw new Error(`Failed to fetch scout: ${error.message}`);
  }

  return data || null;
};

/**
 * Updates a scout in the database.
 *
 * @param id - The ID of the scout to update.
 * @param scoutData - The new data for the scout.
 * @returns The updated scout data.
 * @throws Error if the update operation fails.
 */
export const updateScout = async (
  id: string,
  scoutData: any
): Promise<scout | null> => {
  const supabase = await createClient();

  // Filter out undefined/null values from scoutData
  const filteredscoutData = Object.fromEntries(
    Object.entries(scoutData).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('bots')
    .update(filteredscoutData)
    .eq('id', Number(id))
    .select();

  if (error) {
    throw new Error(`Failed to update scout: ${error.message}`);
  }

  return data?.[0] || null;
};

/**
 * Creates a new interview question for a job.
 *
 * @param question - The interview question text
 * @param sampleResponse - Example of a good response
 * @param order - Order number of the question
 * @param jobId - ID of the job this question is for
 * @throws Error if creation fails
 */
export const createInterviewQuestion = async (
  question: string,
  sampleResponse: string,
  order: number,
  jobId: string
): Promise<any> => {
  const supabase = await createClient();

  if (!question || !sampleResponse || !jobId) {
    throw new Error(
      'Missing required fields: question, sampleResponse, and jobId are required'
    );
  }

  if (typeof order !== 'number') {
    throw new Error('Order must be a number');
  }

  // Get existing questions first
  const { data: existingConfig, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  console.log('existingConfig', existingConfig);

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" error
    throw new Error(
      `Failed to fetch existing questions: ${fetchError.message}`
    );
  }

  // Ensure existingQuestions is an array
  const existingQuestions = Array.isArray(existingConfig?.interview_questions)
    ? existingConfig.interview_questions
    : [];

  // Add new question
  const newQuestion = {
    id: crypto.randomUUID(),
    question,
    sample_response: sampleResponse,
    order
  };
  console.log('newQuestion', newQuestion);

  const updatedQuestions = [...existingQuestions, newQuestion];
  // If config exists, update it. Otherwise create new config.
  const { error: upsertError, data: updatedConfig } = await supabase
    .from('job_interview_config')
    .upsert({
      // job_id: jobId,
      interview_questions: updatedQuestions
      // created_at: new Date().toISOString()
    })
    .eq('job_id', jobId)
    .select();

  if (upsertError) {
    throw new Error(
      `Failed to create interview question: ${upsertError.message}`
    );
  }

  return newQuestion;
};

/**
 * Updates an existing interview question.
 *
 * @param questionId - ID of question to update
 * @param jobId - ID of associated job
 * @param updates - Fields to update
 * @throws Error if update fails
 */
export const updateInterviewQuestion = async (
  questionId: string,
  jobId: string,
  updates: {
    question?: string;
    sample_response?: string; // Changed from 'response' to 'sample_response' to match data structure
  }
): Promise<void> => {
  const supabase = await createClient();

  const { data: config, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch questions: ${fetchError.message}`);
  }

  if (
    !config?.interview_questions ||
    !Array.isArray(config.interview_questions)
  ) {
    throw new Error('No valid questions array found');
  }

  const updatedQuestions = config.interview_questions.map((q: any) =>
    q.id === questionId ? { ...q, ...updates } : q
  );

  const { error: updateError } = await supabase
    .from('job_interview_config')
    .update({ interview_questions: updatedQuestions })
    .eq('job_id', jobId);

  if (updateError) {
    throw new Error(`Failed to update question: ${updateError.message}`);
  }
};

/**
 * Gets all interview questions for a job.
 *
 * @param jobId - ID of the job
 * @returns Array of interview questions
 * @throws Error if fetch fails
 */
export const getInterviewQuestions = async (jobId: string): Promise<any[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch interview questions: ${error.message}`);
  }

  // Ensure we return an array
  return Array.isArray(data?.interview_questions)
    ? data.interview_questions
    : [];
};



/**
 * Creates a new company context in the database.
 *
 * @param companyContextData - The data for the new company context.
 * @returns The created company context data.
 * @throws Error if the creation operation fails.
 */
export const createCompanyContext = async (
  companyContextData: any
): Promise<any> => {
 
  const supabase = await createClient();

  const { data: createdCompanyContext, error: companyContextError } =
    await supabase
      .from('company_context')
      .upsert(companyContextData)
      .select()
      .single();

  if (companyContextError) {
    console.error(
      'Failed to create company context:',
      companyContextError.message
    );
    throw new Error(
      `Failed to create company context: ${companyContextError.message}`
    );
  }

  if (!createdCompanyContext) {
    console.error('Failed to create company context: No data returned');
    throw new Error('Failed to create company context: No data returned');
  }

  console.log('Company context created successfully:', createdCompanyContext);
  return createdCompanyContext;
};

/**
 * Fetches a company context by its ID.
 *
 * @param id - The ID of the company context to fetch.
 * @returns The company context data or null if not found.
 */
export const getCompanyContext = async (id: string): Promise<any | null> => {
  try {
    const supabase = await createClient();
    const { data: companyContext, error } = await supabase
      .from('company_context')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching company context:', error);
      return null;
    }
    return companyContext;
  } catch (err) {
    console.error('Unexpected error fetching company context:', err);
    return null;
  }
};

/**
 * Updates a company context in the database.
 *
 * @param id - The ID of the company context to update.
 * @param companyContextData - The new data for the company context.
 * @returns The updated company context data.
 * @throws Error if the update operation fails.
 */
export const updateCompanyContext = async (
  id: string,
  companyContextData: any
): Promise<any | null> => {
  const supabase = await createClient();
  // Filter out undefined/null values from companyContextData
  const filteredCompanyContextData = Object.fromEntries(
    Object.entries(companyContextData).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('company_context')
    .update(filteredCompanyContextData)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to update company context: ${error.message}`);
  }

  return data;
};

/**
 * Deletes a company context from the database.
 *
 * @param id - The ID of the company context to delete
 * @throws Error if deletion fails
 */
export const deleteCompanyContext = async (id: string): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('company_context')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete company context: ${error.message}`);
  }
};


export const createJob = async (companyId: string, mergeId: string): Promise<any> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .insert({company_id: companyId, merge_id: mergeId})
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
};


/**
 * Updates the job interview configuration with specified columns.
 *
 * @param jobId - The ID of the job to update.
 * @param configData - An object containing the columns to update.
 * @returns The updated job interview config data.
 * @throws Error if the update operation fails.
 */
export const updateJobInterviewConfig = async (
  jobId: string,
  configData: Partial<{
    bot_id: number | null;
    interview_name: string | null;
    type: string | null;
    duration: number | null;
    hiring_manager_notes: string | null;
  }>
): Promise<any> => {
  const supabase = await createClient();

  // Filter out undefined values to ensure only provided fields are updated
  const filteredConfigData = Object.fromEntries(
    Object.entries(configData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredConfigData).length === 0) {
    throw new Error('No valid fields provided for update.');
  }

  // If bot_id is provided, ensure it's a number or null
  if ('bot_id' in filteredConfigData) {
    const scoutId = filteredConfigData.bot_id;
    if (scoutId !== null && typeof scoutId !== 'number') {
      throw new Error('bot_id must be a number or null.');
    }
    // Optionally, you can validate that the bot_id exists in the referenced table
    // This depends on your application's requirements
  }

  try {
    const { data, error } = await supabase
      .from('job_interview_config')
      .update(filteredConfigData)
      .eq('job_id', jobId)
      .single();

    if (error) {
      throw new Error(
        `Failed to update job interview config: ${error.message}`
      );
    }

    return { data, error };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteInterviewQuestion = async (
  questionId: string,
  jobId: string
): Promise<void> => {
  const supabase = await createClient();

  const { data: config, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch questions: ${fetchError.message}`);
  }

  if (
    !config?.interview_questions ||
    !Array.isArray(config.interview_questions)
  ) {
    throw new Error('No valid questions array found');
  }

  // Filter out the question to delete
  const updatedQuestions = config.interview_questions.filter(
    (q: any) => q.id !== questionId
  );

  const { error: updateError } = await supabase
    .from('job_interview_config')
    .update({ interview_questions: updatedQuestions })
    .eq('job_id', jobId);

  if (updateError) {
    throw new Error(`Failed to delete question: ${updateError.message}`);
  }
};

/**
 * Fetches the interview config for a job by its ID.
 *
 * @param jobId - The ID of the job to fetch the interview config for.
 * @returns The interview config data or null if not found.
 */
export const getJobInterviewConfig = async (
  jobId: string
): Promise<any | null> => {
  try {
    const supabase = await createClient();
    const { data: interviewConfig, error } = await supabase
      .from('job_interview_config')
      .select('*')
      .eq('job_id', jobId)
      .single();

    console.log("interviewConfig",interviewConfig)

    if (error) {
      console.error('Error fetching interview config:', error);
      return null;
    }

    return interviewConfig;
  } catch (err) {
    console.error('Unexpected error fetching interview config:', err);
    return null;
  }
};



export const getJob = async (jobId: string): Promise<any | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('merge_id', jobId)
    .single();
  return data || null;
};


export const getSupabaseJobs = async (): Promise<any | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*');
  return data || null;
};

// export const getAISummaryId = async (
//   applicantId: string,
//   jobId: string
// ): Promise<string | null> => {
//   try {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//       .from('applications')
//       .select('AI_summary') // Only fetch AI_summary field
//       .eq('applicant_id', applicantId)
//       .eq('job_id', jobId)
//       .single(); // Fetches a single row
      
//     if (error) {
//       console.error('Error fetching AI Summary ID:', error.message);
//       return null;
//     }
//         return data?.AI_summary || null;
//       } catch (err) {
//         console.error('Unexpected error fetching AI Summary ID:', err);
//         return null;
//       }
//     };



export const getEvaluation = async (AISummaryId: string): Promise<AI_Summary | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('AI_summary')
      .select('*')
      .eq('id', AISummaryId)
      .single(); // Fetches a single row

    if (error) {
      console.error('Error fetching AI summary:', error.message);
      return null;
    }

    return data as AI_Summary; // Type assertion to match the AI_Summary structure
  } catch (err) {
    console.error('Unexpected error fetching AI summary:', err);
    return null;
  }
};

export const getAllEvaluation = async (AISummaryId: string): Promise<Json[] | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('AI_summary')
      .select('text_eval')
      .eq('id', AISummaryId);

    if (error) {
      console.error('Error fetching AI summaries:', error.message);
      return null;
    }

    // Return only the text_eval column data as an array of Json type
    return data?.map((item) => item.text_eval) || null;
  } catch (err) {
    console.error('Unexpected error fetching AI summaries:', err);
    return null;
  }
};

/**
 * Gets the account token for a company associated with an application through its job.
 * 
 * @param applicationId - The ID of the application
 * @returns The account token string or null if not found
 */
export const getAccountTokenFromApplication = async (
  applicationId: string
): Promise<{token: string | null,company: any | null}> => {
  try {
    const supabase = await createClient();
    
    // Join applications -> jobs -> companies to get the account token
    // First get the application to get the job_id
    const { data: applicationData, error: applicationError } = await supabase
      .from('applications')
      .select('job_id')
      .eq('id', applicationId)
      .single();

    if (applicationError) {
      console.error('Error fetching application:', applicationError);
      return {token: null, company: null};
    }

    // Then get the job to get the company_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('company_id, merge_id')
      .eq('merge_id', applicationData.job_id)
      .single();

      
    if (jobError) {
      console.error('Error fetching job:', jobError);
      return {token: null, company: null};
    }

    // Finally get the company details
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, name, merge_account_token')
      .eq('id', jobData?.company_id || '')
      .single();


    if (companyError) {
      console.error('Error fetching company:', companyError);
      return {token: null, company: null};
    }

    const account_token = companyData.merge_account_token
    return {token: account_token, company: companyData};

  } catch (err) {
    console.error('Unexpected error fetching account token:', err);
    return {token: null, company: null};
  }
};




/**
 * Fetches an application by its ID.
 *
 * @param applicationId - The ID of the application to fetch.
 * @returns The application data or null if not found.
 */
export const getApplication = async (applicationId: string): Promise<Tables<'applications'> | null> => {
  try {
    const supabase = await createClient();
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('Error fetching application:', error);
      return null;
    }

    return application;
  } catch (err) {
    console.error('Unexpected error fetching application:', err);
    return null;
  }
};


export const getSupabaseApplications = async (): Promise<Tables<'applications'>[] | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('applications')
    .select('*');
  return data || null;
};


export const createApplication = async (jobId: string, mergeApplicationId: string): Promise<Tables<'applications'> | null> => {  

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('applications')
    .insert({job_id: jobId, merge_application_id: mergeApplicationId})
    .select('*')
    .single();

  if (error) {
    console.error('Error creating application:', error);
    return null;
  }

  return data;
};


export const getApplicationCount = async (): Promise<number> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('applications')
    .select('*');

  if (error) {
    console.error('Error fetching application count:', error);
    return 0;
  }

  return data?.length || 0;
};


/**
 * Fetches an application by its ID.
 *
 * @param mergeId - The merge application ID of the application to fetch.
 * @returns The application data or null if not found.
 */
export const getApplicationByMergeId = async (mergeId: string): Promise<Tables<'applications'> | null> => {
  try {
    const supabase = await createClient();
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('merge_application_id', mergeId)
      .single(); 
    
    if (error) {
      console.error('Error fetching application:', error);
      return null;
    }
    return application;
  } catch (err) {
    console.error('Unexpected error fetching application:', err);
    return null;
  }
};

/**
 * Fetches an applications by job ID.
 *
 * @param mergeId - The job ID of the applications to fetch.
 * @returns The application data or null if not found.
 */
export const getApplicationsByJobId = async (jobId: string): Promise<Tables<'applications'>[] | null> => {
  console.log("jobId", jobId)
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('applications').select();
    console.log(data);
    // why is the table emptyy???

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId);

    if (error) {
      console.error('Error fetching applications:', error);
      return null;
    }

    console.log("data", applications)
    return applications;
  } catch (err) {
    console.error('Unexpected error fetching applications:', err);
    return null;
  }
};


/**
 * Fetches all scouts along with their associated job interview configurations.
 * 
 * This function queries the 'scouts' table to retrieve all scouts and their corresponding
 * job interview configurations. It filters out configurations where the bot_id does not match
 * the current scout's id. The results are ordered by the scout's creation date in descending order.
 * 
 * @returns A promise that resolves to an array of scoutWithJobs objects or throws an error if the query fails.
 */
export const getScoutsWithJobIds = async (): Promise<ScoutWithJobs[]> => {
  const supabase = await createClient();

  // Query to fetch all scouts with their job_interview_configs where bot_id is not null
  const { data: scoutsWithJobs, error } = await supabase
    .from('bots')
    .select(`
      *,
      job_interview_config!left (
        job_id,
        bot_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scouts with jobs:', error);
    throw error;
  }

  // Process the fetched scouts to filter out job_interview_configs where bot_id doesn't match the current scout
  const processedscouts = scoutsWithJobs?.map(scout => ({
    ...scout,
    job_interview_config: scout.job_interview_config?.filter(
      config => config.bot_id === scout.id && config.bot_id !== null
    ) as { job_id: string; bot_id: number }[]
  })) || [];

  return processedscouts;
};

