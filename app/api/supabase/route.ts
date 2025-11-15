import { NextResponse } from 'next/server'

const supabaseURL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  ''

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  ''

export async function POST(request: Request) {
  if (!supabaseURL || !supabaseAnonKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase env vars are not configured.',
      },
      { status: 500 }
    )
  }

  const body = await request.json()
  const targetUrl = `${supabaseURL}${body.path ?? ''}`
  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const res = await fetch(targetUrl, {
      method: body.method ?? 'POST',
      headers,
      body: body.payload ? JSON.stringify(body.payload) : undefined,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[supabase-proxy] error:', error)
    return NextResponse.json(
      { success: false, message: 'Unexpected Supabase proxy error.' },
      { status: 500 }
    )
  }
}

