import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  const attachmentId = params.id;

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  try {
    // Get attachment details
    const attachmentResponse = await fetch(
      `${baseURL}/attachments/${attachmentId}?include_remote_data=true`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      }
    );

    if (!attachmentResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch attachment with id ${attachmentId}` },
        { status: attachmentResponse.status }
      );
    }

    const attachmentData = await attachmentResponse.json();

    // If the attachment has a candidate ID, fetch candidate details
    if (attachmentData.candidate) {
      const candidateResponse = await fetch(
        `${baseURL}/candidates/${attachmentData.candidate}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'X-Account-Token': accountToken
          }
        }
      );

      if (candidateResponse.ok) {
        const candidateData = await candidateResponse.json();
        attachmentData.candidate_details = candidateData;
      }
    }

    return NextResponse.json(attachmentData);

  } catch (error) {
    console.error('Error fetching attachment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attachment details' },
      { status: 500 }
    );
  }
} 