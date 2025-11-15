import { NextResponse } from 'next/server'

const readEnv = (key: string) => process.env[key]

const SUPABASE_URL =
  readEnv('NEXT_PUBLIC_SUPABASE_URL') ??
  readEnv('NEXT_PUBLIC_VITE_SUPABASE_URL') ??
  readEnv('VITE_SUPABASE_URL') ??
  ''

const SUPABASE_ANON_KEY =
  readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ??
  readEnv('NEXT_PUBLIC_VITE_SUPABASE_ANON_KEY') ??
  readEnv('VITE_SUPABASE_ANON_KEY') ??
  ''

export async function GET() {
  const hasConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
  return NextResponse.json(
    {
      success: hasConfig,
      url: SUPABASE_URL,
      key: SUPABASE_ANON_KEY,
      message: hasConfig ? undefined : 'Supabase configuration not found',
    },
    { status: hasConfig ? 200 : 500 }
  )
}

