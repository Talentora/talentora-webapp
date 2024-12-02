// app/api/merge/exchange/[id]/route.ts

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const public_token = params.id;
  console.log('Public token:', public_token);

  try {
    const response = await fetch(
      `https://api.merge.dev/api/integrations/account-token/${public_token}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERGE_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const accountToken = data.account_token;

    return NextResponse.json({ account_token: accountToken });
  } catch (error) {
    console.error('Error exchanging tokens:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to exchange tokens', error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to exchange tokens' },
      { status: 500 }
    );
  }
}