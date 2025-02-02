export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const validForSecs = 3600; // 1 hour

  if (!id) {
    return new Response(JSON.stringify({ error: 'Recording ID is required' }), { status: 400 });
  }

  try {
    const response = await fetch(`https://api.daily.co/v1/recordings/${id}/access-link?valid_for_secs=${validForSecs}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recording access link');
    }

    const data = await response.json();
    console.log('Recording access link response:', data); // Debug log

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching recording access link:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
