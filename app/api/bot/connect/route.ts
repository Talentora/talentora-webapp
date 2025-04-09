import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { roomName, participantName } = await request.json();

  if (!roomName) {
    return NextResponse.json(
      { error: 'Missing "roomName" query parameter' },
      { status: 400 }
    );
  } else if (!participantName) {
    return NextResponse.json(
      { error: 'Missing "participantName" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: participantName });

  at.addGrant({ roomJoin: true, room: roomName });

  return NextResponse.json({ token: await at.toJwt() });
}
