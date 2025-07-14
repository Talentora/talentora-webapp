export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Increase validity period to 7 days (604800 seconds) to avoid expiration issues
  const validForSecs = 43200;
  const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_API_KEY;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Recording ID is required' }), { status: 400 });
  }

  if (!DAILY_API_KEY) {
    console.error('DAILY_API_KEY is missing');
    return new Response(JSON.stringify({ error: 'Configuration error', details: 'API key is missing' }), { status: 500 });
  }

  try {
    // First check if the recording exists
    const checkResponse = await fetch(`https://api.daily.co/v1/recordings/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!checkResponse.ok) {
      console.error('Recording not found or inaccessible:', checkResponse.status);
      return new Response(JSON.stringify({ 
        error: 'Recording Error', 
        details: `Recording not found or inaccessible: ${checkResponse.status}`
      }), { status: 404 });
    }

    // Then get the access link
    const response = await fetch(`https://api.daily.co/v1/recordings/${id}/access-link?valid_for_secs=${validForSecs}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Daily.co API error:', errorText);
      return new Response(JSON.stringify({
        error: 'API Error',
        details: `Failed to fetch recording access link: ${response.status} ${response.statusText}`,
        message: errorText
      }), { status: response.status });
    }

    const data = await response.json();
    console.log('Recording access link response:', data); // Debug log
    
    // Verify the link has proper expiration time
    if (data.expires) {
      const expiresDate = new Date(data.expires * 1000);
      console.log(`Link will expire at: ${expiresDate.toISOString()}`);
    }

    // Modify the response to include a streaming_link property
    // This is the same as download_link but we'll use it differently in the frontend
    if (data.download_link) {
      data.streaming_link = data.download_link;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching recording access link:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};
