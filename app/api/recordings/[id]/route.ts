export async function GET(request: Request) {
    const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY;
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!DAILY_API_KEY) {
        console.error('DAILY_API_KEY is missing');
        return new Response('DAILY_API_KEY is missing', { status: 400 });
    }

    try {
        const response = await fetch(`https://api.daily.co/v1/recordings/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${DAILY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch recording', response.status);
            return new Response(`Failed to fetch recording: ${response.status}`, { status: response.status });
        }

        const data = await response.json();
        console.log('Recording fetched:', data);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching recording:', error);
        return new Response(`Error fetching recording: ${error}`, { status: 500 });
    }
}
