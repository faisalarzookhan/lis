import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

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

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const supabase = await createSupabaseClient();

    // Create or get session
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (!existingSession) {
      const { error } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionId,
          user_id: null, // Anonymous for now
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
