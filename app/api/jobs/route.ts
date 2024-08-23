import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client'; // Adjust the path according to your project structure

// Initialize Supabase client
const supabase = createClient();

// Fetch all jobs
export async function GET() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title, description, salary_range, company_id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(jobs);
}

// Add a new job
export async function POST(request: Request) {
  const { title, description, salary_range, company_id } = await request.json();

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        title,
        description,
        salary_range,
        company_id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// Update an existing job
export async function PUT(request: Request) {
  const { id, title, description, salary_range, company_id } = await request.json();

  const { data, error } = await supabase
    .from('jobs')
    .update({
      title,
      description,
      salary_range,
      company_id,
    })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Delete a job
export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
}
