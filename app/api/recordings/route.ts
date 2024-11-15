export async function GET() {
  const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY;

  if (!DAILY_API_KEY) {
    console.error('DAILY_API_KEY is missing');
    return new Response('DAILY_API_KEY is missing', { status: 400 });
  }

  try {
    const response = await fetch(`https://api.daily.co/v1/recordings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch recordings', response.status);
      return new Response(`Failed to fetch recordings: ${response.status}`, {
        status: response.status
      });
    }

    const data = await response.json();
    console.log('Recordings fetched:', data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return new Response(`Error fetching recordings: ${error}`, { status: 500 });
  }
}
