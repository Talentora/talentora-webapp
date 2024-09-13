import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getSubscription } from '@/utils/supabase/queries';

export async function GET() {
    const supabase = createClient();
    if (supabase) {
        const [user] = await Promise.all([getSubscription(supabase)])
        return NextResponse.json({ user });
    } else {
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
    // const { data, error } = await supabase.from('applicants').select('*');
  
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    // return NextResponse.json({ applicants: data });
  }