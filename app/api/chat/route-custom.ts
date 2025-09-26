import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateResponse } from '../../../scripts/generate-knowledge-base';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentSessionId = sessionId;

    // 1. Create a new session if one isn't provided
    if (!currentSessionId) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({})
        .select('id')
        .single();
      if (sessionError) throw new Error(`Failed to create session: ${sessionError.message}`);
      currentSessionId = sessionData.id;
    }

    // 2. Save the user's message
    const { error: userMessageError } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      sender: 'user',
      content: message,
    });
    if (userMessageError) throw new Error(`Failed to save user message: ${userMessageError.message}`);

    // 3. Generate response using custom knowledge base
    const botResponse = generateResponse(message, []);

    // Add some suggestions based on the response
    let suggestions = [];
    if (botResponse.includes('services')) {
      suggestions = ['Web Development', 'Mobile Apps', 'Cloud Services'];
    } else if (botResponse.includes('pricing') || botResponse.includes('consultation')) {
      suggestions = ['Schedule Consultation', 'View Portfolio', 'Contact Us'];
    } else if (botResponse.includes('portfolio')) {
      suggestions = ['Case Studies', 'Technologies Used', 'Client Testimonials'];
    } else {
      suggestions = ['Explore Services', 'View Portfolio', 'Get Quote'];
    }

    // 4. Save the bot's response
    const { error: botMessageError } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      sender: 'bot',
      content: botResponse,
      suggestions: suggestions,
    });
    if (botMessageError) throw new Error(`Failed to save bot message: ${botMessageError.message}`);

    // 5. Stream the response back to the client
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const chunks = botResponse.split(' ');

        let index = 0;
        const interval = setInterval(() => {
          if (index < chunks.length) {
            const chunk = chunks[index] + ' ';
            controller.enqueue(encoder.encode(chunk));
            index++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 50); // Simulate streaming with 50ms delay between words
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
