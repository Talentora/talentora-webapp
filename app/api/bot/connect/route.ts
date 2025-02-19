import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

import type { Tables } from '@/types/types_db';

export async function POST(request: NextRequest) {
  try {
    // Authentication check (implement your own auth logic)
    const isAuthenticated = await checkAuthentication(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!process.env.NEXT_PUBLIC_INTERVIEW_BOT_URL) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }

    const { data } = await request.json();

    const voiceId = data.voice.id;
    const mergeJob = data.job;
    const company = data.company;
    const jobInterviewConfig = data.jobInterviewConfig;
    const application = data.application;
    const bot = data.bot;
    const companyContext = data.companyContext;
    const enableRecording = data.enableRecording;
    const mock = data.mock;
    const scoutTest = data.scoutTest;
    const demo = data.demo;

    const payload = {
      voice_id: voiceId,
      interview_config: {
        bot_name: bot.name,
        company_name: company.name,
        job_title: mergeJob ? mergeJob.name : '',
        job_description: mergeJob ? mergeJob.description : '',
        company_context: `${companyContext.description} ${companyContext.culture} ${companyContext.goals} ${companyContext.history}`,
        interview_questions: [
          JSON.stringify(jobInterviewConfig.interview_questions)
        ],
        enable_recording: enableRecording,
        mock: mock,
        bot_test: scoutTest,
        demo: demo
      }
    };

    const baseUrl = `${process.env.INTERVIEW_BOT_URL}/api/rooms/`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const botData = await response.json();
    const roomUrl = botData.room_url;
    const roomName = roomUrl.split('/').pop();

    if (enableRecording) {
      const aiSummaryResponse = await createAISummaryRecord(
        roomName,
        application.id
      );
      console.log('AI summary response:', aiSummaryResponse);
      // await updateApplicationWithAISummaryId(application.id, aiSummaryResponse.id);
    }

    return NextResponse.json(botData);
  } catch (error) {
    console.error('Error starting bot:', error);
    return NextResponse.json({ error: 'Failed to start bot' }, { status: 500 });
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
      console.error('Failed to create AI summary record:', error);
      throw error;
    }

    console.log('AI summary record created:', data);
    return data;
  } catch (error) {
    console.error('Error in createAISummaryRecord:', error);
    throw error;
  }
}
