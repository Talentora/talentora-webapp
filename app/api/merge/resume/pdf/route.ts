import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

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

  // Validate the URL to prevent SSRF attacks
  try {
    const parsedUrl = new URL(fileUrl);
    
    // Whitelist allowed domains - adjust based on your actual Merge API domains
    const allowedHosts = [
      'api.merge.dev',
      'files.merge.dev',
      'merge-api-production.s3.amazonaws.com',
      // Add S3 regional endpoints if needed
      /^[a-z0-9-]+\.s3(\.[a-z0-9-]+)?\.amazonaws\.com$/i
    ];
    
    // Check if hostname matches allowed hosts (string or regex)
    const isAllowedHost = allowedHosts.some(host => 
      typeof host === 'string' 
        ? parsedUrl.hostname === host 
        : host.test(parsedUrl.hostname)
    );
    
    if (!isAllowedHost) {
      return NextResponse.json(
        { error: 'Invalid file URL: Unauthorized domain' },
        { status: 400 }
      );
    }
    
    // Ensure HTTPS only
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Invalid file URL: HTTPS required' },
        { status: 400 }
      );
    }
    
    // Prevent localhost and private IPs
    const privateIPPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/i,
      /^fe80:/i
    ];
    
    if (privateIPPatterns.some(pattern => pattern.test(parsedUrl.hostname))) {
      return NextResponse.json(
        { error: 'Invalid file URL: Private network access denied' },
        { status: 400 }
      );
    }
  } catch (urlError) {
    return NextResponse.json(
      { error: 'Invalid file URL: Malformed URL' },
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