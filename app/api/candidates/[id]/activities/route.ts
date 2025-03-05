import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const candidateId = params.id;
  const accountToken = await getMergeApiKey();
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  
  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }
  
  if (!candidateId) {
    return NextResponse.json(
      { error: 'Candidate ID is required' },
      { status: 400 }
    );
  }
  
  // Get activity type from query params if it exists
  const { searchParams } = new URL(req.url);
  const activityType = searchParams.get('type');
  
  try {
    // Construct URL based on whether activity type is provided
    const baseURL = 'https://api.merge.dev/api/ats/v1/activities';
    let activitiesUrl = `${baseURL}?candidate_id=${candidateId}`;
    
    if (activityType) {
      activitiesUrl += `&activity_type=${activityType}`;
    }
    
    const response = await fetch(activitiesUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Merge API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch activities', details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching candidate activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 