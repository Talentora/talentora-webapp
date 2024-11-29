import { NextResponse } from 'next/server';
import { getMergeHeaders, MERGE_BASE_URL } from '@/utils/api/merge';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headers = await getMergeHeaders();
    const response = await fetch(
      `${MERGE_BASE_URL}/users/${params.id}?include_remote_data=true`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
} 