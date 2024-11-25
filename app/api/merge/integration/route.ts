import type { NextApiRequest, NextApiResponse } from 'next';
import { getCompany, getRecruiter } from '@/utils/supabase/queries';
import { getUser } from '@/utils/supabase/queries';
import { NextResponse } from 'next/server';
import { Tables } from '@/types/types_db';

type Company = Tables<'companies'>;

export async function GET(request: Request) {
  async function getCompanyData(): Promise<Company | null> {
    const user = await getUser();

    let responseData = {
      message: '',
      integration_status: 'disconnected',
      billing_address: null,
      company_context: null,
      description: null,
      id: '', // default value for id, or make it null if that's acceptable
      industry: '',
      location: '',
      merge_account_token: null,
      name: '',
      payment_method: null,
      subscription_id: null,
      website_url: null,
    };

    if (!user) {
      responseData.message = 'User not found';
      responseData.integration_status = 'disconnected'
      return NextResponse.json(responseData, { status: 400 });    
    }

    const recruiter = await getRecruiter(user?.id);
    if (!recruiter) {
      responseData.message = 'User not found';
      responseData.integration_status = 'disconnected'
      return NextResponse.json(responseData, { status: 400 });   
    }

    const companyId = recruiter?.company_id;

    if (!companyId) {
      responseData.message = 'Company ID not found';
      responseData.integration_status = 'disconnected'
      return NextResponse.json(responseData, { status: 400 });    
    }
    

    const company = await getCompany(companyId);
    return company;
  }

  const company = await getCompanyData();

  if (!company) {
    return NextResponse.json({ message: 'Company not found', integration_status: 'disconnected' }, { status: 400 });
  }

  try {
    const accountToken = company?.merge_account_token;
    console.log('accountToken', accountToken);

    if (!accountToken) {
      return NextResponse.json({ message: 'Account token not found', integration_status: 'disconnected' }, { status: 400 });
    }

    if (request.method !== 'GET') {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const mergeResponse = await fetch('https://api.merge.dev/api/ats/v1/account-details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERGE_API_KEY}`,
        'X-Account-Token': accountToken,
      },
    });

    const data = await mergeResponse.json();
    console.log('data', data);

    return NextResponse.json({ data, integration_status: 'connected' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error', integration_status: 'disconnected' }, { status: 500 });
  }
}
