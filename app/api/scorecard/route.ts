import { NextRequest, NextResponse } from 'next/server'
import { getMergeApiKey } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - User not found' },
        { status: 401 }
      )
    }

    const role = await getUserRole(supabase, user.id)
    let accountToken = null
    const baseURL = 'https://api.merge.dev/api/ats/v1'
    const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY

    
      accountToken = await getMergeApiKey()
    

    if (!apiKey || !accountToken) {
      console.log('Missing credentials:', {
        apiKey: !apiKey ? 'missing' : 'present',
        accountToken: !accountToken ? 'missing' : 'present'
      })
      return NextResponse.json(
        { error: 'API credentials not found' },
        { status: 500 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const applicationId = searchParams.get('application_id')
    const interviewId = searchParams.get('interview_id')
    const interviewerId = searchParams.get('interviewer_id')

    // Build URL with query parameters
    let url = `${baseURL}/scorecards`
    const params = new URLSearchParams()
    if (applicationId) params.append('application_id', applicationId)
    if (interviewId) params.append('interview_id', interviewId)
    if (interviewerId) params.append('interviewer_id', interviewerId)
    if (params.toString()) url += `?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch scorecards:', await response.text())
      return NextResponse.json(
        { error: 'Failed to fetch scorecards' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data.results)

  } catch (error) {
    console.error('Error in /api/scorecard:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching scorecards' },
      { status: 500 }
    )
  }
}
