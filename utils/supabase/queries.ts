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
type Bot = Tables<'bots'>;
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
      return company.merge_account_token;
    }
  } catch (error) {
    console.error('Error fetching Greenhouse API key:', error);
    throw error;
  }
};


/**
 * Creates a new bot in the database.
 *
 * @param botData - The data for the new bot.
 * @returns The created bot data.
 * @throws Error if the creation operation fails.
 */
export const createBot = async (botData: any) => {
  const supabase = createClient();


  // Insert the bot
  const { data: createdBot, error: botError } = await supabase
    .from('bots')
    .insert(botData)
    

  if (botError) {
    throw new Error(`Failed to create bot: ${botError.message}`);
  }
};

/**
 * Deletes a bot from the database.
 *
 * @param id - The ID of the bot to delete.
 * @throws Error if the deletion operation fails.
 */
export const deleteBot = async (id: number) => {
  const supabase = createClient();

  // Delete the bot
  const { error: botError } = await supabase
    .from('bots')
    .delete()
    .eq('id', id);

  if (botError) {
    throw new Error(`Failed to delete bot: ${botError.message}`);
  }
};




/**
 * Fetches all bots from the database.
 *
 * @returns An array of bot data.
 * @throws Error if the fetch operation fails.
 */
export const getBots = async (): Promise<Bot[] | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bots')
    .select('*');

  if (error) {
    throw new Error(`Failed to fetch bots: ${error.message}`);
  }

  return data || null;
};

/**
 * Fetches a bot by ID from the database.
 *
 * @param id - The ID of the bot to fetch.
 * @returns The bot data or null if not found.
 * @throws Error if the fetch operation fails.
 */
export const getBotById = async (id: string): Promise<Bot | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch bot: ${error.message}`);
  }

  return data || null;
};

/**
 * Updates a bot in the database.
 *
 * @param id - The ID of the bot to update.
 * @param botData - The new data for the bot.
 * @returns The updated bot data.
 * @throws Error if the update operation fails.
 */
export const updateBot = async (id: string, botData: any): Promise<Bot | null> => {
  const supabase = createClient();

  // Filter out undefined/null values from botData
  const filteredBotData = Object.fromEntries(
    Object.entries(botData).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('bots')
    .update(filteredBotData)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to update bot: ${error.message}`);
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
  const supabase = createClient();

  if (!question || !sampleResponse || !jobId) {
    throw new Error('Missing required fields: question, sampleResponse, and jobId are required');
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

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
    throw new Error(`Failed to fetch existing questions: ${fetchError.message}`);
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
  console.log("newQuestion", newQuestion);

  const updatedQuestions = [...existingQuestions, newQuestion];
  // If config exists, update it. Otherwise create new config.
  const { error: upsertError, data: updatedConfig } = await supabase
    .from('job_interview_config')
    .update({
      // job_id: jobId,
      interview_questions: updatedQuestions,
      // created_at: new Date().toISOString()
    })
    .eq('job_id', jobId)
    .select();


  if (upsertError) {
    throw new Error(`Failed to create interview question: ${upsertError.message}`);
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
    sample_response?: string;  // Changed from 'response' to 'sample_response' to match data structure
  }
): Promise<void> => {
  const supabase = createClient();

  const { data: config, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch questions: ${fetchError.message}`);
  }

  if (!config?.interview_questions || !Array.isArray(config.interview_questions)) {
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
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch interview questions: ${error.message}`);
  }

  // Ensure we return an array
  return Array.isArray(data?.interview_questions) ? data.interview_questions : [];
};





// /**
//  * Updates the order of multiple interview questions.
//  *
//  * @param questions - Array of questions with updated order values
//  * @throws Error if reordering fails
//  */
// export const reorderInterviewQuestions = async (
//   questions: { id: string; order: number }[]
// ): Promise<void> => {
//   const supabase = createClient();

//   const { error } = await supabase
//     .from('interview_questions')
//     .upsert(
//       questions.map(q => ({
//         id: q.id,
//         order: q.order
//       }))
//     );

//   if (error) {
//     throw new Error(`Failed to reorder interview questions: ${error.message}`);
//   }
// };


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
  console.log('Attempting to create company context with data:', companyContextData);
  const supabase = createClient();

  const { data: createdCompanyContext, error: companyContextError } = await supabase
    .from('company_context')
    .insert(companyContextData)
    .select()
    .single();

  if (companyContextError) {
    console.error('Failed to create company context:', companyContextError.message);
    throw new Error(`Failed to create company context: ${companyContextError.message}`);
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
export const getCompanyContext = async (
  id: string
): Promise<any | null> => {
  try {
    const supabase = createClient();
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
  const supabase = createClient();
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
  const supabase = createClient();

  const { error } = await supabase
    .from('company_context')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete company context: ${error.message}`);
  }
};



/**
 * Updates the bot selection for a job's interview configuration.
 * 
 * @param jobId - The ID of the job to update
 * @param configData - Object containing the bot_id to update
 * @returns The updated job interview config data
 * @throws Error if the update operation fails
 */
export const updateJobInterviewConfig = async (
  jobId: string,
  configData: {
    bot_id: string;
  }
): Promise<any> => {
  const supabase = createClient();

  // console.log('jobId', jobId);
  
  // // First check if config exists for this job
  // const { data: existingConfig } = await supabase
  //   .from('job_interview_config')
  //   .select('*')
  //   .eq('job_id', jobId)
  //   .single();

  // if (existingConfig) {
  //   console.log('exisitng config found');
    // Update existing config
    const botId = Number(configData.bot_id);
    console.log('botId', botId);
    console.log('jobId', jobId);
    const { data, error } = await supabase
      .from('job_interview_config')
      .update({ bot_id: botId })
      .eq('job_id', jobId)
      .single();

    if (error) {
      throw new Error(`Failed to update job interview config: ${error.message}`);
    }

    return {data,error};

  // } 

  //   if (error) {
  //     throw new Error(`Failed to create job interview config: ${error.message}`);
  //   }

  //   return data;
  // }
};

export const deleteInterviewQuestion = async (
  questionId: string,
  jobId: string
): Promise<void> => {
  const supabase = createClient();

  const { data: config, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch questions: ${fetchError.message}`);
  }

  if (!config?.interview_questions || !Array.isArray(config.interview_questions)) {
    throw new Error('No valid questions array found');
  }

  // Filter out the question to delete
  const updatedQuestions = config.interview_questions.filter((q: any) => q.id !== questionId);

  const { error: updateError } = await supabase
    .from('job_interview_config')
    .update({ interview_questions: updatedQuestions })
    .eq('job_id', jobId);

  if (updateError) {
    throw new Error(`Failed to delete question: ${updateError.message}`);
  }
};


