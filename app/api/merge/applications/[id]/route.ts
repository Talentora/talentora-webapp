import { NextResponse } from 'next/server';
import { getMergeHeaders, MERGE_BASE_URL } from '@/utils/api/merge';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headers = await getMergeHeaders();
    const response = await fetch(
      `${MERGE_BASE_URL}/applications/${params.id}?include_remote_data=true`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch application: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const headers = await getMergeHeaders(undefined, true);
    
    const response = await fetch(`${MERGE_BASE_URL}/applications/${params.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ model: body })
    });

    if (!response.ok) {
      throw new Error(`Failed to update application: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 