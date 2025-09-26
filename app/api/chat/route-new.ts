import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AuralisAI } from '../../../src/lib/auralisAI';
import { ChatContext } from '../../../src/types/chat';

export const runtime = 'edge';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const auralisAI = new AuralisAI();

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentSessionId = sessionId;

    // 1. Create or get session
    if (!currentSessionId) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({})
        .select('id')
        .single();
      if (sessionError) throw new Error(`Failed to create session: ${sessionError.message}`);
      currentSessionId = sessionData.id;
    }

    // 2. Get session context and message count
    const { data: messagesData } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('session_id', currentSessionId);

    const messageCount = messagesData ? messagesData.length + 1 : 1;

    // 3. Set context for AI
    const chatContext: ChatContext = {
      currentPage: context?.currentPage || '/',
      userAgent: context?.userAgent || 'Unknown',
      referrer: context?.referrer,
      sessionStartTime: new Date().toISOString(),
      messageCount,
      lastActivity: new Date().toISOString()
    };

    auralisAI.setContext(chatContext);

    // 4. Detect intent
    const intent = auralisAI.detectIntent(message);
    auralisAI.addToHistory(message, intent);

    // 5. Check for escalation
    const escalation = auralisAI.detectComplexity(message, messageCount);

    // 6. Save user message
    const { error: userMessageError } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      sender: 'user',
      content: message,
    });
    if (userMessageError) throw new Error(`Failed to save user message: ${userMessageError.message}`);

    // 7. Generate response
    const botResponse = await auralisAI.generateResponse(message, intent);

    // 8. Generate proactive suggestions
    const suggestions = auralisAI.generateProactiveSuggestions(intent, chatContext);

    // 9. Save bot response with suggestions
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      sender: 'bot',
      content: botResponse,
      metadata: { suggestions, intent: intent.intent, escalation: escalation ? true : false }
    });

    // 10. Log analytics
    await supabase.from('chat_analytics').insert({
      session_id: currentSessionId,
      intent: intent.intent,
      confidence: intent.confidence,
      escalation_triggered: escalation ? true : false,
      page_context: chatContext.currentPage,
      message_length: message.length
    });

    // 11. Prepare response data
    const responseData = {
      response: botResponse,
      suggestions,
      intent: intent.intent,
      escalation: escalation ? {
        triggered: true,
        reason: escalation.reason,
        priority: escalation.priority
      } : null
    };

    // 12. Stream the response back
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const words = botResponse.split(' ');
        let index = 0;

        const sendWord = () => {
          if (index < words.length) {
            const word = words[index] + ' ';
            controller.enqueue(encoder.encode(word));
            index++;
            setTimeout(sendWord, 30); // Faster typing for better UX
          } else {
            controller.close();
          }
        };

        sendWord();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Auralis-Intent': intent.intent,
        'X-Auralis-Suggestions': JSON.stringify(suggestions),
        'X-Auralis-Escalation': escalation ? 'true' : 'false'
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: (error as Error).message || 'An unexpected error occurred' }, { status: 500 });
  }
}
