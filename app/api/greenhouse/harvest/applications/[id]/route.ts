// app/api/applications/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_GREENHOUSE_API_KEY;
  const applicationId = params.id;
  const baseURL = `https://harvest.greenhouse.io/v1/applications/${applicationId}`;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch application with id ${applicationId}` }, { status: response.status });
    }

    const application = await response.json();
    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching the application' }, { status: 500 });
  }
}
