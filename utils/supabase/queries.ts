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
 * Creates a new interview question by updating the job_interview_config table.
 * 
 * @param question - The question text
 * @param response - The example response text
 * @param order - The display order of the question
 * @param jobId - The ID of the job this question belongs to (required)
 * @returns The updated job_interview_config data
 * @throws Error if creation fails
 */
export const createInterviewQuestion = async (
  question: string,
  response: string,
  order: number, 
  jobId: string
): Promise<any> => {
  const supabase = createClient();

  if (!question?.trim()) {
    throw new Error('Question text is required');
  }
  if (!response?.trim()) {
    throw new Error('Example response text is required');
  }
  if (typeof order !== 'number') {
    throw new Error('Question order must be a number');
  }
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  // First get existing interview questions
  const { data: existingConfig, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // Ignore not found error
    throw new Error(`Failed to fetch existing questions: ${fetchError.message}`);
  }

  const existingQuestions = existingConfig?.interview_questions || [];
  
  // Add new question
  const newQuestion = {
    id: crypto.randomUUID(), // Generate unique ID for the question
    question: question.trim(),
    sample_response: response.trim(),
    order
  };

  const updatedQuestions = [...existingQuestions, newQuestion];

  // Update job_interview_config
  const { data, error } = await supabase
    .from('job_interview_config')
    .upsert({
      job_id: jobId,
      interview_questions: updatedQuestions
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create interview question: ${error.message}`);
  }

  return newQuestion;
};

/**
 * Gets all interview questions for a specific job from the database.
 * 
 * @param jobId - The ID of the job
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

  const questions = data?.interview_questions || [];
  return questions.sort((a: any, b: any) => a.order - b.order);
};

/**
 * Updates an interview question in the job_interview_config table.
 *
 * @param questionId - The ID of the question to update
 * @param jobId - The ID of the job this question belongs to
 * @param questionData - The updated question data
 * @returns The updated question data
 * @throws Error if update fails
 */
export const updateInterviewQuestion = async (
  questionId: string,
  jobId: string,
  questionData: {
    question?: string;
    sample_response?: string;
    order?: number;
  }
): Promise<any> => {
  const supabase = createClient();

  // Get existing questions
  const { data: existingConfig, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch existing questions: ${fetchError.message}`);
  }

  const questions = existingConfig?.interview_questions || [];
  
  // Update the specific question
  const updatedQuestions = questions.map((q: any) => 
    q.id === questionId ? { ...q, ...questionData } : q
  );

  // Update job_interview_config
  const { data, error } = await supabase
    .from('job_interview_config')
    .update({ interview_questions: updatedQuestions })
    .eq('job_id', jobId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview question: ${error.message}`);
  }

  return updatedQuestions.find((q: any) => q.id === questionId);
};

/**
 * Deletes an interview question from the job_interview_config table.
 *
 * @param questionId - The ID of the question to delete
 * @param jobId - The ID of the job this question belongs to
 * @throws Error if deletion fails
 */
export const deleteInterviewQuestion = async (
  questionId: string,
  jobId: string
): Promise<void> => {
  const supabase = createClient();

  // Get existing questions
  const { data: existingConfig, error: fetchError } = await supabase
    .from('job_interview_config')
    .select('interview_questions')
    .eq('job_id', jobId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch existing questions: ${fetchError.message}`);
  }

  const questions = existingConfig?.interview_questions || [];
  
  // Filter out the question to delete
  const updatedQuestions = questions.filter((q: any) => q.id !== questionId);

  // Update job_interview_config
  const { error } = await supabase
    .from('job_interview_config')
    .update({ interview_questions: updatedQuestions })
    .eq('job_id', jobId);

  if (error) {
    throw new Error(`Failed to delete interview question: ${error.message}`);
  }
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
 * Creates a new job interview configuration in the database.
 * 
 * @param configData - The data for the new job interview configuration
 * @returns The created configuration data
 * @throws Error if creation fails
 */
export const createJobInterviewConfig = async (configData: any): Promise<any> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_interview_config')
    .insert(configData)
    .single();

  if (error) {
    throw new Error(`Failed to create job interview config: ${error.message}`);
  }

  return data;
};

/**
 * Retrieves a job interview configuration by ID.
 *
 * @param id - The ID of the job interview configuration to fetch
 * @returns The job interview configuration data or null if not found
 * @throws Error if fetch fails
 */
export const getJobInterviewConfig = async (id: string): Promise<any | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_interview_config')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch job interview config: ${error.message}`);
  }

  return data;
};

/**
 * Updates an existing job interview configuration.
 *
 * @param id - The ID of the configuration to update
 * @param configData - The new configuration data
 * @returns The updated configuration data
 * @throws Error if update fails
 */
export const updateJobInterviewConfig = async (
  id: string,
  configData: any
): Promise<any> => {
  const supabase = createClient();

  // Filter out undefined/null values
  const filteredConfigData = Object.fromEntries(
    Object.entries(configData).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('job_interview_config')
    .update(filteredConfigData)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to update job interview config: ${error.message}`);
  }

  return data;
};

/**
 * Deletes a job interview configuration.
 *
 * @param id - The ID of the configuration to delete
 * @throws Error if deletion fails
 */
export const deleteJobInterviewConfig = async (id: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from('job_interview_config')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete job interview config: ${error.message}`);
  }
};
