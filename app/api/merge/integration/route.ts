import type { NextApiRequest, NextApiResponse } from 'next';
import { useCompany } from '@/hooks/useCompany';

export async function GET(request: Request, response: NextApiResponse) {
  const { company } = useCompany();
  const accountToken = company?.merge_account_token;
  console.log('accountToken', accountToken);

  if (!accountToken) {
    return response.status(400).json({ message: 'Account token not found', integration_status: 'disconnected' });
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const mergeResponse = await fetch('https://api.merge.dev/api/ats/v1/account-details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERGE_API_KEY}`,
        'X-Account-Token': accountToken,
      },
    });

    const data = await mergeResponse.json();

    return response.status(200).json({ data, integration_status: 'connected' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Internal Server Error', integration_status: 'disconnected' });
  }
};
