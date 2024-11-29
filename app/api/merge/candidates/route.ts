import { NextResponse } from 'next/server';
import { getMergeHeaders, MERGE_BASE_URL } from '@/utils/api/merge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams({
      ...(searchParams.get('created_after') && { created_after: searchParams.get('created_after')! }),
      ...(searchParams.get('created_before') && { created_before: searchParams.get('created_before')! }),
      ...(searchParams.get('cursor') && { cursor: searchParams.get('cursor')! }),
      ...(searchParams.get('email_addresses') && { email_addresses: searchParams.get('email_addresses')! }),
      ...(searchParams.get('expand') && { expand: searchParams.get('expand')! }),
      ...(searchParams.get('first_name') && { first_name: searchParams.get('first_name')! }),
      ...(searchParams.get('include_deleted_data') && { include_deleted_data: searchParams.get('include_deleted_data')! }),
      ...(searchParams.get('include_remote_data') && { include_remote_data: searchParams.get('include_remote_data')! }),
      ...(searchParams.get('last_name') && { last_name: searchParams.get('last_name')! }),
      ...(searchParams.get('modified_after') && { modified_after: searchParams.get('modified_after')! }),
      ...(searchParams.get('modified_before') && { modified_before: searchParams.get('modified_before')! }),
      ...(searchParams.get('page_size') && { page_size: searchParams.get('page_size')! }),
      ...(searchParams.get('remote_id') && { remote_id: searchParams.get('remote_id')! })
    });

    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/candidates?${queryParams}`, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers = await getMergeHeaders(undefined, true);
    
    const response = await fetch(`${MERGE_BASE_URL}/candidates`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: body })
    });

    if (!response.ok) {
      throw new Error(`Failed to create candidate: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
} 