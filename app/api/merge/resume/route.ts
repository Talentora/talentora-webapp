import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

/**
 * Handles GET requests to retrieve attachment details from an external API based on a validated `attachmentId` query parameter.
 *
 * Returns a JSON response containing the attachment data if successful, or an error message with the appropriate HTTP status code if credentials are missing, the attachment ID is invalid, the external API request fails, or an unexpected error occurs.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1/attachments`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;


  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }
  
  const attachmentId = url.searchParams.get('attachmentId');

  // Validate attachmentId to ensure it matches a predefined pattern (e.g., UUID or alphanumeric)
  const validAttachmentIdPattern = /^[a-zA-Z0-9_-]{1,64}$/;
  if (!attachmentId || !validAttachmentIdPattern.test(attachmentId)) {
    return NextResponse.json({ error: 'Invalid Attachment ID' }, { status: 400 });
  }

  try {
    // Make a request to the external API to fetch the attachment details
    const response = await fetch(`${baseURL}/${attachmentId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Account-Token': accountToken
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch attachment' }, { status: response.status });
    }

    // Parse the response body to JSON
    const data = await response.json();

    // Return the data in JSON format
    console.log("Resume file url:", data.file_url);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching attachment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
