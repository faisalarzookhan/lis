import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const runtime = 'edge';

// Zod schema for page creation
const pageSchema = z.object({
  page_name: z.string().min(1, 'Page name is required'),
  content: z.string().optional(),
  is_published: z.boolean().optional(),
});

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

// GET: Fetch all pages (admin-only for management)
export async function GET() {
  const supabase = await createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('id, page_name, content, is_published, version, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ pages: data ?? [] }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pages';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new page (admin-only)
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseClient();
  try {
    const body = await request.json();
    const validated = pageSchema.parse(body);

    const { data, error } = await supabase
      .from('pages')
      .insert([{ page_name: validated.page_name, content: validated.content, is_published: validated.is_published }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map(issue => issue.message) }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to create page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
