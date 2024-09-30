// [POST] /api
import { defaultBotProfile, defaultMaxDuration } from '@/utils/rtvi.config';

export async function POST(request: Request) {
  console.log('Received request:', request);

  const { services, config } = await request.json();
  console.log('Parsed request body:', { services, config });

  if (!services || !config || !process.env.NEXT_PUBLIC_DAILY_BOTS_URL) {
    console.error(
      'Services or config not found on request body or environment variable missing'
    );
    return new Response(`Services or config not found on request body`, {
      status: 400
    });
  }

  const payload = {
    bot_profile: defaultBotProfile,
    max_duration: defaultMaxDuration,
    services,
    api_keys: {
      openai: process.env.OPENAI_API_KEY
    },
    config: [...config]
  };
  console.log('Payload to be sent:', payload);

  const req = await fetch(process.env.NEXT_PUBLIC_DAILY_BOTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}`
    },
    body: JSON.stringify(payload)
  });
  console.log('Request sent to external API:', req);

  const res = await req.json();
  console.log('Response from external API:', res);

  if (req.status !== 200) {
    console.error('Error response from external API:', res);
    return Response.json(res, { status: req.status });
  }

  console.log('Successful response from external API:', res);
  return Response.json(res);
}
