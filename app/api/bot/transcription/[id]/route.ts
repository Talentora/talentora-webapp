export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY;
  const format = req.headers.get('x-transcript-format') || 'txt';

  if (!DAILY_API_KEY) {
    console.error('DAILY_API_KEY is missing');
    return new Response('DAILY_API_KEY is missing', { status: 400 });
  }

  try {
    // First fetch the access link data
    const accessResponse = await fetch(`https://api.daily.co/v1/batch-processor/${id}/access-link`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!accessResponse.ok) {
      console.error('Failed to fetch transcript access link', accessResponse.status, accessResponse.statusText);
      return new Response(`Failed to fetch transcript: ${accessResponse.status}`, {
        status: accessResponse.status
      });
    }

    const accessData = await accessResponse.json();
    
    // Find the requested format transcript link
    const transcriptFile = accessData.transcription.find((t: any) => t.format === format);
    
    if (!transcriptFile) {
      return new Response(`Transcript format ${format} not found`, { status: 404 });
    }

    // Fetch the actual transcript content
    const transcriptResponse = await fetch(transcriptFile.link);
    const transcriptContent = await transcriptResponse.text();

    return new Response(transcriptContent, { 
      status: 200,
      headers: {
        'Content-Type': format === 'json' ? 'application/json' : 'text/plain'
      }
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return new Response(`Error fetching transcript: ${error}`, { status: 500 });
  }
}
