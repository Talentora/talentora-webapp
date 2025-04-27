import { getCompany, getRecruiter } from '@/utils/supabase/queries';
import { getUser } from '@/utils/supabase/queries';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
  async function getCompanyData() {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'User not found', integration_status: 'disconnected' }, { status: 400 });
    }

    const recruiter = await getRecruiter(user?.id);
    if (!recruiter) {
      return NextResponse.json({ message: 'Recruiter not found', integration_status: 'disconnected' }, { status: 400 });
    }

    const companyId = recruiter?.company_id;

    if (!companyId) {
      return NextResponse.json({ message: 'Company ID not found', integration_status: 'disconnected' }, { status: 400 });
    }
    
    const company = await getCompany(companyId);
    return company;
  }

  const company = await getCompanyData();

  if (!company || company instanceof NextResponse) {
    return NextResponse.json({ message: 'Company not found', integration_status: 'disconnected' }, { status: 400 });
  }

  try {

    const accountToken = company.merge_account_token;

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

    return NextResponse.json({ data, integration_status: 'connected' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error', integration_status: 'disconnected' }, { status: 500 });
  }
}