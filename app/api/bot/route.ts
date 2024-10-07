// [POST] /api
import { defaultBotProfile, defaultMaxDuration } from '@/utils/rtvi.config';

export async function POST(request: Request) {

  const OPENAI_API_KEY= process.env.OPENAI_API_KEY;
  const DAILY_API_KEY=process.env.NEXT_PUBLIC_DAILY_API_KEY

  console.log('Received request:', request);

  const { services, config } = await request.json();
  console.log('Parsed request body:', { services, config });

  if (!services || !config) {
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
      openai: OPENAI_API_KEY
    },
    config: [...config]
  };
  console.log('Payload to be sent:', payload);

  console.log('Sending request to external API...',DAILY_API_KEY);
  const req = await fetch("https://api.daily.co/v1/bots/start", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`
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
