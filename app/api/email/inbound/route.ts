import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await req.json()
    // TODO: verify provider signature and map to conversation
    // Store email content to conversations/messages with channel = 'email'
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 400 })
  }
}
