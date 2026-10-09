import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const apiOrigin = process.env.NEXT_PUBLIC_API_URL;
  if (!apiOrigin) {
    return NextResponse.json({ error: 'API not configured' }, { status: 500 });
  }
  const upstream = await fetch(`${apiOrigin}/v1/subscriptions/itn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return new NextResponse(await upstream.text(), { status: upstream.status });
}