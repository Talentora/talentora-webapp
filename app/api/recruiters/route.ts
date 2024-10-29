import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET() {
  const accountToken = await getMergeApiKey();
  const baseURL = 'https://api.merge.dev/api/ats/v1/users';
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json({ error: 'API credentials not found' }, { status: 500 });
  }

  try {
    const response = await fetch(baseURL, {
      headers: {
        'Accept': 'application/json', 
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.results, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}
