// app/api/getUserRole/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }
  console.log(userId, "userid in route.ts");

    const supabase = createClient();
    const { data, error } = await supabase
        .from('recruiters')
        .select('id')
        .eq('id', userId)
        .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Could not fetch role' }, { status: 500 });
  }
  if (data && !error) {
    return NextResponse.json({ role: 'recruiter' });
} else {
    console.log('User is an applicant2');
    return NextResponse.json({ role: 'applicant' });
}
 
}
