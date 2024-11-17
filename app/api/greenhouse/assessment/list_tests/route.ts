// app/api/greenhouse/list_tests/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const tests = [
    { id: 1, name: 'Sample Test 1', description: 'A sample assessment test.' },
    { id: 2, name: 'Sample Test 2', description: 'Another sample test.' },
  ];

  return NextResponse.json({ tests });
}
