import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'Invalid request',
      message: 'An error occurred while processing the request.',
    },
    { status: 400 }
  );
}
