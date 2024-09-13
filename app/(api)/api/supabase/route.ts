import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function GET() {
    const supabase = createClient();
    if (supabase) {
        return NextResponse.json({ supabase }, { status: 200});
    } else {
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
    // const { data, error } = await supabase.from('applicants').select('*');
  
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    // return NextResponse.json({ applicants: data });
  }