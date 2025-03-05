import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function POST(req: Request) {
  const accountToken = await getMergeApiKey();
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  
  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }
  
  try {
    const { candidateId, notes, visibility } = await req.json();
    
    if (!candidateId || !notes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a note activity for the candidate using Merge API
    const response = await fetch('https://api.merge.dev/api/ats/v1/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      },
      body: JSON.stringify({
        activity_type: 'NOTE',
        body: notes,
        visibility: visibility || 'PRIVATE',
        candidate: candidateId
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Merge API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to save candidate notes', details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving candidate notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 