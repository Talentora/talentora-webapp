import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

/**
 * Handles GET requests to fetch and serve a PDF file from a validated external URL.
 *
 * Validates the `fileUrl` query parameter to ensure it is a well-formed, HTTPS URL from an allowed domain and not a private or localhost address. If validation passes, fetches the PDF from the external source and returns it with appropriate headers. Returns descriptive JSON error responses for missing credentials, invalid URLs, unauthorized domains, or fetch failures.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileUrl = url.searchParams.get('fileUrl');
  const accountToken = await getMergeApiKey();
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  if (!fileUrl) {
    return NextResponse.json(
      { error: 'File URL is required' },
      { status: 400 }
    );
  }

import { validateExternalUrl } from '@/app/api/merge/utils/security';

  if (!fileUrl) {
    return NextResponse.json(
      { error: 'File URL is required' },
      { status: 400 }
    );
  }

  // Validate the URL to prevent SSRF attacks
  const validation = validateExternalUrl(fileUrl);
  if (!validation.valid) {
    return NextResponse.json(
      { error: `Invalid file URL: ${validation.error}` },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const pdfBlob = await response.blob();
    
    // Return the PDF blob with appropriate headers
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
} 