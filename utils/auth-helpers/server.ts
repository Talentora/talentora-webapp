'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { getAuthTypes } from '@/utils/auth-helpers/settings';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return '/';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'You could not be signed in.',
      error.message
    );
  } else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/signin/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
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

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

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

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Sign in failed.',
      error.message
    );
    redirectPath = `/signin/password_signin?role=${role}`
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/dashboard' });
    redirectPath = getStatusRedirect('/dashboard', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
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
  const fullName = String(formData.get('fullName')).trim();
  const role = String(formData.get('role')).trim();
  let redirectPath: string;

  console.log(`Signing up as a ${role}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${'*'.repeat(password.length)}`); // Masking the password for security

  if (!isValidEmail(email)) {
    console.log('Invalid email format detected.');
    redirectPath = getErrorRedirect(
      `/signin/signup?role=${role}`,
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createClient();

  console.log('Supabase client created. Attempting to sign up user...');
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,

      data: { role: role, full_name: fullName }
    }
  });

  if (error) {

    redirectPath = `/signin/signup?role=${role}`
    // redirectPath = getStatusRedirect(
    //   `/signin/signup?role=${role}`,
    //   'Sign up failed.',
    //   error.message
    // );
  } else if (data.session) {
    console.log('Sign-up successful with active session.');
    redirectPath = `/signin/signup?role=${role}`

    // redirectPath = getStatusRedirect(
    //   '/settings/onboarding',
    //   'Success!',
    //   `You are now signed in as a ${role}.`
    // );
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    console.log('Sign-up failed: Account already exists with no identities.');
    redirectPath = getStatusRedirect(
      `/signin/signup?role=${role}`,
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.'
    );

  } else if (data.user) {
    console.log('Sign-up successful: Email confirmation required.');
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

  return redirectPath;
}

export async function uploadProfilePhoto(photoFile: File) {
  const supabase = createClient();
  const user = supabase.auth.user();

  // Check if the user is authenticated
  if (!user) {
    throw new Error('User not authenticated');
  }

  const fileName = `profile_photos/${user.id}/${photoFile.name}`;
  const { data, error } = await supabase.storage
    .from('profile-photos') // Specify your bucket name
    .upload(fileName, photoFile);

  if (error) {
    return { error, data: null };
  }

  // You can return the URL or any necessary info after uploading
  const photoUrl = supabase.storage.from('profile-photos').getPublicUrl(fileName);
  return { error: null, data: photoUrl };
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

  const supabase = createClient();
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

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  const supabase = createClient();

  const callbackUrl = getURL(
    getStatusRedirect('/account', 'Success!', `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/account',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}


export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createClient();
  console.log('access name');
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/account',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}
