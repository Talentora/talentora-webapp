import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Authentication check (implement your own auth logic)
    const isAuthenticated = await checkAuthentication(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = await request.json();


    const voiceId = data.voice.id;
    const mergeJob = data.job;
    const company = data.company;
    const jobInterviewConfig = data.jobInterviewConfig;
    const application = data.application;
    const bot = data.bot;
    const companyContext = data.companyContext;


    const payload = {
  bot_profile: "vision_2024_10",
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
          value: voiceId
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
                  text: `You are an AI interviewer name ${bot.name}. You are interviewing a candidate for a job - ${mergeJob.name}. Here's the job description: ${mergeJob.description}`
                },
                {
                  type: "text",
                  text: `Here's some additional information about the company: ${company.description}`
                },
                {
                  type: "text",
                  text: `Here's are some sample interview questions: ${JSON.stringify(jobInterviewConfig.interview_questions)}`
                },
                {
                  type: "text",
                  text: `This is the ${jobInterviewConfig.interview_name} ${jobInterviewConfig.type} interview. You are an AI interviewer with the role of ${bot.role}. Here's some additional information about you: ${bot.description}. You've been given the following instructions: ${bot.prompts}`
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