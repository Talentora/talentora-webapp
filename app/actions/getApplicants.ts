'use server'

import { createClient } from '@/utils/supabase/client'
import { getApplicants } from '@/utils/supabase/queries'

export async function fetchApplicants(jobId: number) {
  const supabase = await createClient()
  return getApplicants(supabase, jobId)
}