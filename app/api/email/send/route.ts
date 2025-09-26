import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the Resend client with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, from, subject, html } = await request.json();

    if (!to || !from || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields: to, from, subject, html' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Email sent successfully', id: data?.id }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
