import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server'

import type { Tables } from '@/types/types_db';

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
                  role: "system",
                  content: [
                    {
                      type: "text",
                      text: "Conduct this interview professionally and conversationally. Your goal is to assess the candidate's fit for the role by:\n- Listening carefully to each response\n- Asking follow-up questions that reveal deeper insights\n- Maintaining a warm but professional demeanor\n- Being direct and clear in your communication"
                    },
                    {
                      type: "text",
                      text: `You are ${bot.name}, an AI interviewer conducting an interview for the ${mergeJob.name} position at ${company.name}. Your aim is to evaluate the candidate's qualifications, experience, and potential cultural fit.`
                    },
                    {
                      type: "text",
                      text: `Job Description: ${mergeJob.description}`
                    },
                    {
                      type: "text",
                      text: `Company Context: ${company.description}`
                    },
                    {
                      type: "text",
                      text: "Interview Guidelines:\n- Be authentic and present like a human interviewer\n- If you don't know something or need clarification, ask the candidate\n- Focus on understanding the candidate's skills, motivations, and potential\n- Use the prepared questions as a guide, but be flexible\n- Pay attention to not just what is said, but how it is said"
                    },
                    {
                      type: "text",
                      text: `Prepared Interview Questions: ${JSON.stringify(jobInterviewConfig.interview_questions)}`
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
        },
        {
          service: "stt",
          options: [
            {
              name: "model",
              value: "nova-2-medical"
            },
            {
              name: "language",
              value: "en"
            },
            {
              name: "filler_word",
              value: true
            },
            {
              name: "redact",
              value: "ssn"
            }
          ]
        }
      ],
      recording_settings: {
        type: "cloud"
      },
     
    };

    const baseUrl = "https://api.daily.co/v1/bots/start";

    const response = await fetch(baseUrl, {
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
    const roomUrl = botData.room_url;
    const roomName = roomUrl.split('/').pop();

    console.log("Room URL:", roomUrl);
    console.log("Room name:", roomName);

    const aiSummaryResponse = await createAISummaryRecord(roomName, application.id);
    console.log("AI summary response:", aiSummaryResponse);
    // await updateApplicationWithAISummaryId(application.id, aiSummaryResponse.id);



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



async function createAISummaryRecord(roomName: string, applicationId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('AI_summary')
      .insert({
        room_name: roomName,
        created_at: new Date().toISOString(),
        application_id: applicationId
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create AI summary record:", error);
      throw error;
    }

    console.log("AI summary record created:", data);
    return data;
  } catch (error) {
    console.error("Error in createAISummaryRecord:", error);
    throw error;
  }
}
