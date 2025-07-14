// app/api/merge/exchange/[id]/route.ts

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; userId: string }> }
) {
  const { token, userId } = await params;


  try {
    const response = await fetch(
      `https://api.merge.dev/api/integrations/account-token/${token}`,
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

    const linkedAccountResponse = await fetch('https://api.merge.dev/api/ats/v1/linked-accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MERGE_API_KEY}`,
        'X-Account-Token': accountToken,
        'Content-Type': 'application/json'
      }
    });

    if (!linkedAccountResponse.ok) {
      const errorData = await linkedAccountResponse.json();
      return NextResponse.json(errorData, { status: linkedAccountResponse.status });
    }

    const linkedAccountData = await linkedAccountResponse.json();

    const linkedAccountId = linkedAccountData.results.find((result: any) => result.end_user_origin_id === userId)?.id;

    return NextResponse.json(
      { 
        account_token: accountToken, 
        linked_account_id: linkedAccountId
      }
    );


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