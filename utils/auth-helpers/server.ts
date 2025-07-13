'use server';

import { createClient, createAuthClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { fetchApplicationMergeId } from '@/server/applications';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createAuthClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
    }
  })
  
  console.log(data, error);

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      error.message,
      'Please try again.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/signin/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {

  const cookieStore = cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  const role = String(formData.get('role')).trim();
  let redirectPath: string;

  let candidate_id = String(formData.get('candidateId'))
  if (candidate_id) { candidate_id = candidate_id.trim(); }

  let job_id = String(formData.get('jobId'))
  if (job_id) { job_id = job_id.trim(); }
  
  let application_id = String(formData.get('applicationId'))
  if (application_id) { application_id = application_id.trim(); }

  // Use auth client for authentication (compatible with middleware)
  const authSupabase = createAuthClient();
  const { error, data } = await authSupabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Sign in failed.',
      error.message
    );

    console.log('sign in had error, received redirect path:', redirectPath);
    console.log('Error details:', error);

    redirectPath = `/signin/password_signin?role=${role}`;
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', {
      path: '/dashboard'
    });
    redirectPath = getStatusRedirect(
      '/dashboard',
      'Success!',
      'You are now signed in.'
    );

    console.log('Successful sign in, received redirect path:', redirectPath);

    if (candidate_id && job_id && role === 'applicant') { // special token sign in
      const applicantId = data.user.id;

      try {
        // Use service role client for database operations
        const supabase = createClient();
        addUserToApplicationsTable(supabase, applicantId, candidate_id, job_id, application_id);
        addUserToApplicantsTable(supabase, applicantId, email, data.user.user_metadata.full_name, candidate_id);
      } catch (err: any) {
        redirectPath = getStatusRedirect(
          '/',
          'Critical signin error, please contact Talentora team for support',
          'You could not be signed in.'
        );
      }
    }

  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );

    console.log('sign in simply failed, received redirect path:', redirectPath);
  }

  return redirectPath;
}

/**
 * Signs up a new user using the provided form data.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Promise<string>} - A promise that resolves to a redirect path based on the outcome of the sign-up process.
 *
 * The function performs the following steps:
 * 1. Extracts and trims the email and password from the form data.
 * 2. Validates the email format.
 * 3. Creates a Supabase client and attempts to sign up the user.
 * 4. Handles various outcomes of the sign-up process:
 *    - Invalid email address.
 *    - Sign-up failure with an error message.
 *    - Successful sign-up with an active session.
 *    - Existing account with no identities.
 *    - Successful sign-up requiring email confirmation.
 *    - General failure.
 *
 * The function returns a redirect path based on the outcome, which can be used to navigate the user to the appropriate page.
 */
export async function signUp(formData: FormData) {
  console.log('Starting sign-up process...');
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  const fullName = String(formData.get('full_name')).trim();
  const role = String(formData.get('role')).trim();
  
  // Get company ID for recruiters
  let companyId: string | null = null;
  const companyIdValue = formData.get('companyId');
  if (companyIdValue !== null && role === 'recruiter') {
    companyId = String(companyIdValue).trim();
  }
  
  let candidate_id: string | null = null;
  const candidateIdValue = formData.get('candidateId');
  if (candidateIdValue !== null) {
    candidate_id = String(candidateIdValue).trim();
  }

  let application_id: string | null = null;
  const applicationIdValue = formData.get('application_id');
  if(applicationIdValue !== null) {
    application_id = String(applicationIdValue).trim();
  }

  let redirectPath: string;

  console.log(`Signing up as a ${role}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${'*'.repeat(password.length)}`);
  if (role === 'recruiter') {
    console.log(`Company ID: ${companyId}`);
  }

  if (!isValidEmail(email)) {
    console.log('Invalid email format detected.');
    redirectPath = getErrorRedirect(
      `/signin/signup?role=${role}`,
      'Invalid email address.',
      'Please try again.'
    );
    return redirectPath;
  }

  // Use service role client for database operations (company validation)
  const supabase = await createClient();
  // Use auth client for authentication (compatible with middleware)
  const authSupabase = createAuthClient();

  console.log('Supabase client created. Attempting to sign up user...');
  
  try {
    // For recruiters with company ID, validate company exists and is not configured
    if (role === 'recruiter' && companyId) {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, Configured')
        .eq('id', companyId)
        .single();
      
      if (companyError || !company) {
        console.error('Company validation error:', companyError);
        redirectPath = getErrorRedirect(
          `/signin/signup?role=${role}`,
          'Invalid Company ID',
          'The company ID provided does not exist.'
        );
        return redirectPath;
      }
      
      if (company.Configured) {
        console.error('Company already configured');
        redirectPath = getErrorRedirect(
          `/signin/signup?role=${role}`,
          'Company Already Set Up',
          'This company already has recruiter accounts. Please contact your administrator.'
        );
        return redirectPath;
      }
    }
    const firstName = fullName.split(' ')[0];

    const { error, data } = await authSupabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackURL,
        data: { name: firstName, role: role, full_name: fullName }
      }
    });


    if (error) {
      console.error('Sign-up error:', error);
      
      // Special handling for "User already registered" error
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        // Fix: ensure we're using '&' and not a second '?' for query parameters
        redirectPath = getErrorRedirect(
          `/signin/signup?role=${role}`,  // Base path with first query param
          'Account already exists',       // Error name
          'There is already an account associated with this email address. Try signing in or resetting your password.'
        );
      } else {
        redirectPath = getErrorRedirect(
          `/signin/signup?role=${role}`,
          'Sign up failed.',
          error.message
        );
      }
    } else if (
      data.user &&
      data.user.identities &&
      data.user.identities.length == 0
    ) {
      console.log('Sign-up failed: Account already exists with no identities.');
      redirectPath = getErrorRedirect(
        `/signin/signup?role=${role}`,
        'Account already exists',
        'There is already an account associated with this email address. Try resetting your password.'
      );
      
    } else if (data.user) {
      console.log('Sign-up successful: Email confirmation required.');
      
      // Add user to applicants table if role is applicant
      if (role === 'applicant' && data.user) {
        console.log('Adding user to applicants table');
        await addUserToApplicantsTable(supabase, data.user.id, email, fullName, candidate_id);
        
        // If we have a candidate_id, link the user to their application
        if (candidate_id) {
          const jobId = formData.get('jobId')?.toString()?.trim() || null;
          if (jobId) {
            await addUserToApplicationsTable(supabase, data.user.id, candidate_id, jobId, application_id);
          }
        }
      }
      
      // Add user to recruiters table and update company if role is recruiter
      if (role === 'recruiter' && data.user && companyId) {
        // Add user to recruiters table
        const { error: recruiterError } = await supabase
          .from('recruiters')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            company_id: companyId
          }); 
        if (recruiterError) {
          console.error('Error adding user to recruiters table:', recruiterError);
        }
      }
      
      redirectPath = getStatusRedirect(
        '/',
        'Success!',
        'Please check your email for a confirmation link. You may now close this tab.'
      );
    } else {
      console.log('Sign-up failed: Unknown error.');
      redirectPath = getErrorRedirect(
        `/signin/signup?role=${role}`,
        'Hmm... Something went wrong.',
        'You could not be signed up.'
      );
    }
  } catch (err: any) {
    console.error('Exception during sign-up:', err);
    redirectPath = getErrorRedirect(
      `/signin/signup?role=${role}`,
      'Sign up failed.',
      err.message || 'An unexpected error occurred'
    );
  }

  return redirectPath;
}

/**
 * Helper function to add or update a user in the applicants table
 * @param supabase - Supabase client
 * @param userId - User ID to use as applicant ID
 * @param email - User's email
 * @param fullName - User's full name
 * @param candidateId - Optional candidate ID to add to merge_candidate_id array
 */
async function addUserToApplicantsTable(
  supabase: any,
  userId: string,
  email: string,
  fullName: string,
  candidateId: string | null
) {

  if (candidateId === "") { return; }
  
  try {
    // First check if the user already exists in applicants table
    const { data: existingApplicant, error: fetchError } = await supabase
      .from('applicants')
      .select('merge_candidate_id')
      .eq('id', userId)
      .maybeSingle(); 
    
    let mergeIds: string[] = [];
    
    // If user exists, use existing merge_candidate_id array
    if (existingApplicant?.merge_candidate_id) {
      mergeIds = existingApplicant.merge_candidate_id;
    }
    
    // Add candidateId to mergeIds if it doesn't exist and is not null
    if (candidateId && !mergeIds.includes(candidateId)) {
      mergeIds.push(candidateId);
    }
    
    // Upsert user data to applicants table
    const { error: upsertError } = await supabase
      .from('applicants')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        merge_candidate_id: mergeIds
      })
      .select();
    
    if (upsertError) {
      console.error('Error adding user to applicants table:', upsertError);
    } else {
      console.log('Successfully added/updated user in applicants table');
    }
  } catch (err) {
    console.error('Exception when adding user to applicants table:', err);
  }
  
}

/**
 * Helper function to add or update a user in the applications table
 * @param supabase - Supabase client
 * @param applicantId - User ID / Applicant ID to use as foreign key
 * @param candidateId - Candidate ID from Merge
 * @param jobId - Job ID from Merge
 * @param applicationId - Application ID from Merge (optional)
 */
async function addUserToApplicationsTable(
  supabase: any,
  applicantId: string,
  candidateId: string,
  jobId: string,
  applicationId?: string | null
) {

  try {
    // Use provided application ID if available, otherwise fetch it
    let mergeApplicationId = applicationId;
    if (!mergeApplicationId) {
      try {
        mergeApplicationId = await fetchApplicationMergeId(jobId, candidateId);
        console.log('Fetched application ID:', mergeApplicationId);
      } catch (error) {
        console.error('Error fetching application ID:', error);
        return;
      }
    }

    if (!mergeApplicationId) {
      console.error('Could not fetch application ID for candidate and job');
      return;
    }

    // Check if the application record exists
    const { data: existingApplication, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('merge_application_id', mergeApplicationId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching application:', fetchError);
      return;
    }

    // Update the existing application with the applicant_id or create a new one
    if (existingApplication) {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          applicant_id: applicantId,
          status: 'pending_interview',
          job_id: jobId
         })
        .eq('merge_application_id', mergeApplicationId);

      if (updateError) {
        console.error('Error updating application with applicant ID:', updateError);
      } else {
        console.log('Successfully updated application with applicant ID');
      }
    } else {
      // If no application exists, create one
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          merge_application_id: mergeApplicationId,
          applicant_id: applicantId,
          job_id: jobId,
          status: 'pending_interview',
        });

      if (insertError) {
        console.error('Error creating application record:', insertError);
      } else {
        console.log('Successfully created application with applicant ID');
      }
    }
  } catch (err) {
    console.error('Exception when updating applications table:', err);
  }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }

  const supabase = createAuthClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }

  return redirectPath;
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createAuthClient();
  console.log('access name');
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/settings?tab=account',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/settings?tab=account',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/settings?tab=account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}

/**
 * Get user session details from the server.
 * This is a dedicated server action for safely getting user information without cookie issues.
 * 
 * @returns {Promise<{user: any | null, role: string | null, isSidebarVisible: boolean}>}
 */
export async function getUserSessionDetails() {
  try {
    const authSupabase = await createAuthClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    
    const role = user?.user_metadata?.role || null;
    const isSidebarVisible = role === 'recruiter';
    
    // Fetch company data for recruiters
    let company = null;
    if (user && role === 'recruiter') {
      // Use service role client for database operations
      const supabase = createClient();
      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (recruiterData?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', recruiterData.company_id)
          .single();
        company = companyData;
      }
    }
    
    return { user, role, isSidebarVisible, company };
  } catch (error) {
    console.error("Error getting user session details:", error);
    return { user: null, role: null, isSidebarVisible: false, company: null };
  }
}
