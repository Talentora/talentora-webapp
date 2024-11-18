// // [POST] /api
// import {
//   defaultBotProfile,
//   defaultMaxDuration,
//   defaultServices,
//   defaultConfig
// } from '@/utils/rtvi.config';

// export async function POST(request: Request) {
//   const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//   const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY;
//   console.log('DAILY_API_KEY:', DAILY_API_KEY);

//   console.log('Received request:', request);


//   const payload = {
//     bot_profile: defaultBotProfile,
//     max_duration: defaultMaxDuration,
//     services: defaultServices,
//     api_keys: {
//       openai: OPENAI_API_KEY
//     },
//     config: defaultConfig,
//     recording_settings: {
//       type: 'cloud'
//     },
//     service_options: {
//       vad: {
//         stop_secs: 0.5
//       }
//     }

//   };
//   console.log('Payload to be sent:', payload);

//   console.log('Sending request to external API...', DAILY_API_KEY);
//   const req = await fetch('https://api.daily.co/v1/bots/start', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${DAILY_API_KEY}`
//     },
//     body: JSON.stringify(payload)
//   });
//   console.log('Request sent to external API:', req);

//   const res = await req.json();
//   console.log('Response from external API:', res);

//   if (req.status !== 200) {
//     console.error('Error response from external API:', res);
//     return Response.json(res, { status: req.status });
//   }

//   console.log('Successful response from external API:', res);
//   return Response.json(res);
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Authentication check (implement your own auth logic)
    const isAuthenticated = await checkAuthentication(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { services, config } = await request.json();

    const payload = {
  bot_profile: "voice_2024_10",
  max_duration: 300,
  service_options: {
    deepgram: {
      model: "nova-2-general",
      language: "en"
    },
    anthropic: {
      model: "claude-3-5-sonnet-20241022"
    }
  },
  services: {
    stt: "deepgram",
    tts: "cartesia",
    llm: "anthropic"
  },
  config: [
    {
      service: "vad",
      options: [
        {
          name: "params",
          value: {
            stop_secs: 0.3
          }
        }
      ]
    },
    {
      service: "tts",
      options: [
        {
          name: "voice",
          value: "79a125e8-cd45-4c13-8a67-188112f4dd22"
        },
        {
          name: "language",
          value: "en"
        },
        {
          name: "text_filter",
          value: {
            filter_code: false,
            filter_tables: false
          }
        },
        {
          name: "model",
          value: "sonic-english"
        }
      ]
    },
    {
      service: "llm",
      options: [
        {
          name: "initial_messages",
          value: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "You are an assistant called Daily Bot. You can ask me anything. Keep responses brief and legible. Start by briefly introducing yourself.\n\nYour responses will be converted to audio. Please do not include any special characters in your response other than '!' or '?'."
                }
              ]
            }
          ]
        },
        {
          name: "run_on_config",
          value: true
        }
      ]
    }
  ]
};

    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DAILY_BOT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const botData = await response.json();
    return NextResponse.json(botData);
  } catch (error) {
    console.error("Error starting bot:", error);
    return NextResponse.json(
      { error: "Failed to start bot" },
      { status: 500 }
    );
  }
}

// Placeholder function for authentication
async function checkAuthentication(request: NextRequest): Promise<boolean> {
  // Implement your authentication logic here
  return true;
}