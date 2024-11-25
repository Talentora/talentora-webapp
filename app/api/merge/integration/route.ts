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
      billing_address: null as string | null, // Explicitly define null as string | null
      company_context: null as string | null,
      description: null as string | null,
      id: '' as string, // Ensure id is string or set as ''
      industry: '' as string,
      location: '' as string,
      merge_account_token: null as string | null,
      name: '' as string,
      payment_method: null as string | null,
      subscription_id: null as string | null,
      website_url: null as string | null,
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
    if (!company) {
      responseData.message = 'Company not found';
      return NextResponse.json(responseData, { status: 400 });
    }

    // Assuming company object exists, populate the response data
    responseData = {
      ...responseData,
      id: company.id || '',
      name: company.name || '',
      industry: company.industry || '',
      location: company.location || '',
      // Add any other company properties you need
    };

    // Return company data along with the integration status
    responseData.integration_status = 'connected';
    return NextResponse.json(responseData, { status: 200 });
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
