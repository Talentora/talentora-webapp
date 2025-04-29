'use server';

import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { roomName, participantName, contextData } = await request.json();

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

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {

    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  try {
    // Create the AccessToken with the participant identity
    const at = new AccessToken(apiKey, apiSecret, { identity: participantName });
    // Add the basic room grant with recording enabled
    at.addGrant({ 
      roomJoin: true, 
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      // recorder: true // Enable recording capabilities
    });

    // If context data is provided, add it as metadata to the token
    if (contextData) {
      // Ensure contextData is serialized properly for token metadata
      at.metadata = JSON.stringify({
        type: 'interview_context',
        isRecruiter: true,
        enableRecording: true, // Flag to indicate recording should be enabled
        ...contextData
      });
    }

    // Generate the JWT
    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate access token' },
      { status: 500 }
    );
  }
}
