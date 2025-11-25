import { NextRequest, NextResponse } from 'next/server'

// Proxy target for dashboard APIs to avoid CORS in the browser.
const rawBase =
  process.env.NEXT_PUBLIC_SUBSCRIPTION_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  'http://localhost:5050'

const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`

const buildTargetUrl = (slug: string[] = [], search: string) => {
  const path = slug.join('/')
  const query = search ? `?${search}` : ''
  return `${API_BASE}/dashboard/${path}${query}`
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const targetUrl = buildTargetUrl(params.slug || [], req.nextUrl.searchParams.toString())

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    })

    const body = await upstream.text()

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to reach dashboard backend', detail: error?.message || 'unknown error' },
      { status: 502 }
    )
  }
}
