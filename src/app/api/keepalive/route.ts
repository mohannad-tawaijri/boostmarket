import { NextResponse } from 'next/server';

// This route is called by a Vercel cron job every 10 minutes to prevent
// the Render free-tier backend from spinning down due to inactivity.
export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL_INTERNAL
    || 'https://boost-api-16ta.onrender.com';

  try {
    const start = Date.now();
    const res = await fetch(`${backendUrl}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(30_000), // 30s timeout
    });
    const elapsed = Date.now() - start;

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: message, timestamp: new Date().toISOString() },
      { status: 200 }, // Return 200 so Vercel doesn't mark the cron as failed
    );
  }
}
