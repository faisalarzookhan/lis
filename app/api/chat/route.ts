import { NextRequest, NextResponse } from 'next/server';
import { AuralisAI } from '../../../src/lib/auralisAI';
import { createClient } from '@supabase/supabase-js';
import { logger } from '../../../src/lib/logger';

export const runtime = 'nodejs';

// Initialize Supabase client if environment variables are available
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

const ai = new AuralisAI();

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentSessionId = sessionId || `session-${Date.now()}`;

    // 1. Create a new session if one isn't provided and Supabase is available
    if (!sessionId && supabase) {
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({})
          .select('id')
          .single();
        if (!sessionError && sessionData) {
          currentSessionId = sessionData.id;
        }
      } catch (error) {
        logger.warn('Database not available, using in-memory session', { error });
      }
    }

    // 2. Save the user's message if Supabase is available
    if (supabase) {
      try {
        await supabase.from('chat_messages').insert({
          session_id: currentSessionId,
          sender: 'user',
          content: message,
        });
      } catch (error) {
        logger.warn('Failed to save user message to database', { error, sessionId: currentSessionId });
      }
    }

    // 3. Detect intent
    const intent = ai.detectIntent(message);

    // 4. Generate response using custom AI
    const botResponse = await ai.generateResponse(message, intent);

    // 5. Save the bot's response if Supabase is available
    if (supabase) {
      try {
        await supabase.from('chat_messages').insert({
          session_id: currentSessionId,
          sender: 'bot',
          content: botResponse,
        });
      } catch (error) {
        logger.warn('Failed to save bot response to database', { error, sessionId: currentSessionId });
      }
    }

    // 6. Stream the response back to the client
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const chunks = botResponse.split(' ');
        let index = 0;

        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk = chunks[index] + ' ';
            controller.enqueue(encoder.encode(chunk));
            index++;
            // Use setImmediate for efficient streaming without blocking
            if (typeof setImmediate !== 'undefined') {
              setImmediate(sendChunk);
            } else {
              // Fallback for environments without setImmediate
              setTimeout(sendChunk, 0);
            }
          } else {
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    logger.error('Chat API error', error);
    return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
  }
}
