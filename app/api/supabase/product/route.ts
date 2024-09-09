import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getProducts } from '@/utils/supabase/queries';

export async function GET() {
    const supabase = createClient();
    if (supabase) {
        const [user] = await Promise.all([getProducts(supabase)])
        return NextResponse.json({ user }, { status: 200 });
    } else {
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
  }