import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUser } from '@/utils/supabase/queries';

export async function GET() {
    const supabase = createClient();
    if (supabase) {
        const [user] = await Promise.all([getUser(supabase)])
        return NextResponse.json({ user }, { status: 200 });
    } else {
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
    // const { data, error } = await supabase.from('applicants').select('*');
  
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    // return NextResponse.json({ applicants: data });
  }