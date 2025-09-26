import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

// Helper function to create a Supabase client with user session
const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

// GET: Fetch chatbot analytics
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseClient();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  try {
    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get total conversations
    const { count: totalConversations, error: convError } = await supabase
      .from('chat_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (convError) throw convError;

    // Get total messages
    const { count: totalMessages, error: msgError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (msgError) throw msgError;

    // Get average session duration (simplified - using time between first and last message)
    const { data: sessions, error: sessionError } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        created_at,
        chat_messages!inner(created_at)
      `)
      .gte('created_at', startDate.toISOString());

    if (sessionError) throw sessionError;

    let totalDuration = 0;
    let sessionCount = 0;

    sessions?.forEach(session => {
      if (session.chat_messages && session.chat_messages.length > 1) {
        const messages = session.chat_messages.sort((a: { created_at: string }, b: { created_at: string }) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const duration = new Date(messages[messages.length - 1].created_at).getTime() -
                        new Date(messages[0].created_at).getTime();
        totalDuration += duration;
        sessionCount++;
      }
    });

    const averageSessionDuration = sessionCount > 0 ? totalDuration / sessionCount / 60000 : 0; // in minutes

    // Get top queries (simplified - most common user messages)
    const { data: topQueriesData, error: queriesError } = await supabase
      .from('chat_messages')
      .select('content')
      .eq('sender', 'user')
      .gte('created_at', startDate.toISOString())
      .limit(1000);

    if (queriesError) throw queriesError;

    const queryCount: Record<string, number> = {};
    topQueriesData?.forEach(msg => {
      const query = msg.content.toLowerCase().trim();
      if (query.length > 3) { // Ignore very short queries
        queryCount[query] = (queryCount[query] || 0) + 1;
      }
    });

    const topQueries = Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    // Get user satisfaction (from feedback)
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('chat_feedback')
      .select('rating')
      .gte('created_at', startDate.toISOString());

    if (feedbackError) throw feedbackError;

    const positiveFeedback = feedbackData?.filter(f => f.rating === 'positive').length || 0;
    const totalFeedback = feedbackData?.length || 0;
    const userSatisfaction = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0;

    // Get daily stats (simplified)
    const dailyStats = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const { count: conversations } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${dateStr}T00:00:00.000Z`)
        .lt('created_at', `${dateStr}T23:59:59.999Z`);

      const { count: messages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${dateStr}T00:00:00.000Z`)
        .lt('created_at', `${dateStr}T23:59:59.999Z`);

      dailyStats.push({
        date: dateStr,
        conversations: conversations || 0,
        messages: messages || 0,
      });
    }

    return NextResponse.json({
      totalConversations: totalConversations || 0,
      totalMessages: totalMessages || 0,
      averageSessionDuration,
      userSatisfaction,
      topQueries,
      dailyStats,
    }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
