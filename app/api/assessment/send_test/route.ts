import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    status: 'Test sent',
    message: 'The test has been successfully sent to the candidate.'
  });
}
