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

// PATCH: Reorder FAQs (admin-only)
export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseClient();
  try {
    const { faqs } = await request.json();

    if (!Array.isArray(faqs)) {
      return NextResponse.json({ error: 'Invalid faqs array' }, { status: 400 });
    }

    // Update sort_order for each FAQ
    const updates = faqs.map(({ id, sort_order }) =>
      supabase
        .from('faqs')
        .update({ sort_order })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);

    if (errors.length > 0) {
      throw new Error('Failed to update some FAQs');
    }

    return NextResponse.json({ message: 'FAQs reordered successfully' }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to reorder FAQs';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
