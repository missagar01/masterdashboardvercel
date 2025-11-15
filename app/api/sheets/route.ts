import { NextResponse } from 'next/server';

const APP_SCRIPT_URL =
  process.env.NEXT_PUBLIC_APP_SCRIPT_URL ??
  process.env.NEXT_PUBLIC_VITE_APP_SCRIPT_URL ??
  process.env.APP_SCRIPT_URL ??
  process.env.VITE_APP_SCRIPT_URL ??
  '';

if (!APP_SCRIPT_URL) {
  // eslint-disable-next-line no-console
  console.warn('[sheets-api] App Script URL env is not defined. Sheets API proxy will fail.');
}

export async function GET(request: Request) {
  if (!APP_SCRIPT_URL) {
    return NextResponse.json(
      { success: false, message: 'App Script URL env is not configured.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sheetName = searchParams.get('sheetName');

  if (!sheetName) {
    return NextResponse.json(
      { success: false, message: 'sheetName query param is required.' },
      { status: 400 }
    );
  }

  const targetUrl = `${APP_SCRIPT_URL}?sheetName=${encodeURIComponent(sheetName)}`;

  try {
    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch data from Google Apps Script.' },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[sheets-api] Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Unexpected error fetching sheet.' },
      { status: 500 }
    );
  }
}

