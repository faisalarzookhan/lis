import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Zod schema for page update
const pageUpdateSchema = z.object({
  page_name: z.string().min(1, 'Page name is required').optional(),
  content: z.string().optional(),
  is_published: z.boolean().optional(),
});

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

// GET: Fetch a specific page by page_name
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('pages')
      .select('id, page_name, content, is_published, version, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page: data }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update a specific page (admin-only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = params;
    const body = await request.json();
    const validated = pageUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (validated.page_name !== undefined) updateData.page_name = validated.page_name;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (validated.is_published !== undefined) updateData.is_published = validated.is_published;

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map(issue => issue.message) }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to update page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: Update specific fields of a page (admin-only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = params;
    const body = await request.json();
    const validated = pageUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (validated.page_name !== undefined) updateData.page_name = validated.page_name;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (validated.is_published !== undefined) updateData.is_published = validated.is_published;

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map(issue => issue.message) }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to update page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a specific page (admin-only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = params;

    const { error } = await supabase.from('pages').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
