import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(request: Request) {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidate_id');
  const createdAfter = searchParams.get('created_after');
  const createdBefore = searchParams.get('created_before');

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  try {
    // Construct URL with query parameters
    let attachmentsUrl = `${baseURL}/attachments?`;
    if (candidateId) attachmentsUrl += `candidate_id=${candidateId}&`;
    if (createdAfter) attachmentsUrl += `created_after=${createdAfter}&`;
    if (createdBefore) attachmentsUrl += `created_before=${createdBefore}&`;

    const attachmentsResponse = await fetch(attachmentsUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!attachmentsResponse.ok) {
      throw new Error(`Failed to fetch attachments: ${attachmentsResponse.statusText}`);
    }

    const attachmentsData = await attachmentsResponse.json();
    return NextResponse.json(attachmentsData.results);

  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attachments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { file_name, file_url, candidate, attachment_type } = body;

    const response = await fetch(`${baseURL}/attachments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      },
      body: JSON.stringify({
        model: {
          file_name,
          file_url,
          candidate,
          attachment_type
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating attachment:', error);
    return NextResponse.json(
      { error: 'Failed to create attachment' },
      { status: 500 }
    );
  }
} 