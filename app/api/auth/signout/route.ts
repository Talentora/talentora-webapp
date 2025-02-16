import { SignOut } from '@/utils/auth-helpers/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await SignOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
