import { NextResponse } from 'next/server';
import { getGreenhouseApiKey } from '@/utils/supabase/queries';

const TIMEOUT_MS = 10000; // 10 seconds timeout

export async function GET(request: Request) {
  const apiKey = await getGreenhouseApiKey();
  const baseURL = 'https://harvest.greenhouse.io/v1/users';

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  // Get query parameters
  const url = new URL(request.url);
  const perPage = url.searchParams.get('per_page') || '100';
  const page = url.searchParams.get('page') || '1';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${baseURL}?per_page=${perPage}&page=${page}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status });
    }

    const users = await response.json();
    console.log('Successfully fetched users:', users.length);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
    }
    return NextResponse.json({ error: 'An error occurred while fetching users' }, { status: 500 });
  }
}