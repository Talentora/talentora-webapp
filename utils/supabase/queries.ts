'use server';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/server';
import { BotWithJobs } from '@/types/custom';
type Recruiter = Tables<'recruiters'>;
type Company = Tables<'companies'>;
type Bot = Tables<'bots'>;
import { inviteRecruiterAdmin, inviteCandidateAdmin, listUsersAdmin } from '@/utils/supabase/admin';
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

export async function inviteCandidate(
  name: string,
  email: string,
  candidate_id: string,
  job_id: string
): Promise<{ data?: any; error?: string | null }> {
  try {
    // Check if user already exists in auth.users
    const supabase = createClient();
    const { data: existingUser, error: userCheckError } = await listUsersAdmin();
    const userExists = existingUser?.users?.some(user => user.email === email);

    if (userCheckError) {
      console.error('Error checking existing user:', userCheckError);
      return {
        data: null,
        error: 'Failed to check if user exists'
      };
    }

    if (userExists) {
      return {
        data: null,
        error: 'User with this email already exists'
      };
    }


    const candidate = await inviteCandidateAdmin(name, email);
    
    // Return early if invitation failed
    if (!candidate) {
      return {
          data: null,
          error: candidate.error instanceof Error ? candidate.error.message : candidate.error || 'Failed to invite candidate'
        };
    }

    console.log('candidate', candidate);

    const candidateId = candidate?.user?.id;
    // console.log('candidateId', candidateId);

    if (!candidateId) {
      return {
        data: null,
        error: 'Failed to get candidate ID'
      };
    }

    // Create application record linking the job and new user
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        applicant_id: candidateId,
        job_id: job_id,
        // status: 'pending'  
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Error creating application:', applicationError);
      return {
        data: null,
        error: applicationError.message
      };
    }

    return {
      data: {
        candidate: candidate.data,
        application: application
      },
      error: null
    };

  } catch (err) {
    console.error('Error in inviteCandidate:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
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
export const createBot = async (botData: any): Promise<Tables<'bots'>> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bots')
    .insert(botData)
    .select()
    .single();

  if (error) {
    console.error('Failed to create bot:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from bot creation');
  }

  return data;
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
  const { error: botError } = await supabase.from('bots').delete().eq('id', id);

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
export const getBots = async (): Promise<BotWithJobs[] | null> => {
  try {
    const botsWithJobIds = await getBotsWithJobIds();
    return botsWithJobIds;

  } catch (error) {
    console.error('Failed to fetch bots:', error);
    return null;
  }
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
export const updateBot = async (
  id: string,
  botData: any
): Promise<Bot | null> => {
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
    .update({
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
  const supabase = createClient();

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
  return Array.isArray(data?.interview_questions)
    ? data.interview_questions
    : [];
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
  console.log(
    'Attempting to create company context with data:',
    companyContextData
  );
  const supabase = createClient();

  const { data: createdCompanyContext, error: companyContextError } =
    await supabase
      .from('company_context')
      .insert(companyContextData)
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
  const supabase = createClient();

  // Filter out undefined values to ensure only provided fields are updated
  const filteredConfigData = Object.fromEntries(
    Object.entries(configData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredConfigData).length === 0) {
    throw new Error('No valid fields provided for update.');
  }

  // If bot_id is provided, ensure it's a number or null
  if ('bot_id' in filteredConfigData) {
    const botId = filteredConfigData.bot_id;
    if (botId !== null && typeof botId !== 'number') {
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
  const supabase = createClient();

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
    const supabase = createClient();
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('merge_id', jobId)
    .single();
  return data || null;
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
    const supabase = createClient();
    
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
    const supabase = createClient();
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


/**
 * Creates a new AI summary record for an application.
 *
 * @param applicationId - The ID of the application to create summary for
 * @param recordingId - The ID of the recording to associate with the summary
 * @returns The created AI summary record or null if creation failed
 */
export const createAISummary = async (
  applicationId: string,
  recordingId: string
): Promise<Tables<'AI_summary'> | null> => {
  try {
    const supabase = createClient();
    const { data: aiSummary, error } = await supabase
      .from('AI_summary')
      .insert([{
        application_id: applicationId,
        recording_id: recordingId,
      }])
      .select()
      .single();

    console.log("aiSummary", aiSummary)

    if (error) {
      console.error('Error creating AI summary:', error);
      return null;
    }

    return aiSummary;
  } catch (err) {
    console.error('Unexpected error creating AI summary:', err);
    return null;
  }
};

/**
 * Fetches all bots along with their associated job interview configurations.
 * 
 * This function queries the 'bots' table to retrieve all bots and their corresponding
 * job interview configurations. It filters out configurations where the bot_id does not match
 * the current bot's id. The results are ordered by the bot's creation date in descending order.
 * 
 * @returns A promise that resolves to an array of BotWithJobs objects or throws an error if the query fails.
 */
export const getBotsWithJobIds = async (): Promise<BotWithJobs[]> => {
  const supabase = createClient();

  // Query to fetch all bots with their job_interview_configs where bot_id is not null
  const { data: botsWithJobs, error } = await supabase
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
    console.error('Error fetching bots with jobs:', error);
    throw error;
  }

  // Process the fetched bots to filter out job_interview_configs where bot_id doesn't match the current bot
  const processedBots = botsWithJobs?.map(bot => ({
    ...bot,
    job_interview_config: bot.job_interview_config?.filter(
      config => config.bot_id === bot.id && config.bot_id !== null
    ) as { job_id: string; bot_id: number }[]
  })) || [];

  return processedBots;
};
