import type { Tables } from '@/types/types_db';

type Price = Tables<'prices'>;

export const getURL = (path: string = '') => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ||
    process?.env?.NEXT_PUBLIC_VERCEL_URL ||
    'http://localhost:3000';

  // Ensure the URL is valid
  try {
    url = new URL(url).origin;
  } catch {
    url = 'http://localhost:3000';
  }

  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ['status', 'status_description'],
  error: ['error', 'error_description']
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  console.log(`Created redirect path: ${redirectPath}`);

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string = '',
  errorDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );

// Improved function to extract error messages from URL parameters with better error handling
export const extractErrorMessageFromURL = (searchParams: URLSearchParams | string): string | null => {
  let params: URLSearchParams;
  
  // Handle if we're given a string instead of URLSearchParams
  if (typeof searchParams === 'string') {
    try {
      // Check if it's a full URL or just a query string
      if (searchParams.startsWith('http') || searchParams.startsWith('/')) {
        // If it contains multiple question marks (malformed URL), fix it
        if ((searchParams.match(/\?/g) || []).length > 1) {
          searchParams = searchParams.replace(/\?/g, (match, index) => 
            index === (searchParams as string).indexOf('?') ? match : '&'
          );
        }
        params = new URL(searchParams, window.location.origin).searchParams;
      } else {
        // It's just a query string
        params = new URLSearchParams(searchParams);
      }
    } catch (e) {
      console.error('Error parsing URL:', e);
      return null;
    }
  } else {
    params = searchParams;
  }
  
  const errorName = params.get('error');
  const errorDescription = params.get('error_description');
  
  if (errorName) {
    // Check for specific error patterns
    if (errorName.includes('User already registered') || 
        errorName.includes('already exists') || 
        errorName.includes('Account already exists') ||
        errorDescription?.includes('already registered') ||
        errorDescription?.includes('already associated')) {
      return 'An account already exists with this email address. Try signing in or resetting your password.';
    }
    
    // Try to parse JSON error messages that might be serialized
    if (errorDescription && (errorDescription.startsWith('{') || errorDescription.includes('\\'))) {
      try {
        // Clean up potential escaped JSON
        const cleanedDesc = errorDescription.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
        const parsedError = JSON.parse(cleanedDesc);
        if (parsedError.message) {
          return parsedError.message;
        }
      } catch (e) {
        // If parsing fails, just use the original description
        console.error('Error parsing JSON error message:', e);
      }
    }
    
    return errorDescription ? `${errorName}: ${errorDescription}` : errorName;
  }
  
  return null;
};

