import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    test_id: 1,
    status: 'completed',
    score: '85%',
  });
}
