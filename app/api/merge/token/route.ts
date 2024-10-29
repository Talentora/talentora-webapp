// app/api/merge/link/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    end_user_origin_id,
    end_user_organization_name,
    end_user_email_address,
    categories
  } = await req.json();

  try {
    const response = await fetch(
      'https://api.merge.dev/api/integrations/create-link-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERGE_API_KEY}` // Add this to your .env.local file
        },
        body: JSON.stringify({
          end_user_origin_id,
          end_user_organization_name,
          end_user_email_address,
          categories
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { message: 'Failed to create link token', error: error.message },
      { status: 500 }
    );
  }
}
