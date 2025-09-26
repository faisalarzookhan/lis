import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route handler provides a full CRUD API for FAQs.
// GET is public, while POST, PUT, and DELETE are admin-only,
// protected by Row Level Security (RLS) policies in the database.

export const runtime = 'edge';

// Helper function to create a Supabase client for the current user
const createSupabaseClient = (request: NextRequest) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: request.headers.get('Authorization')! } }
    }
  );
};

// GET: Fetch all FAQs (publicly accessible)
export async function GET(request: NextRequest) {
  const supabase = createSupabaseClient(request);
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer, category')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ faqs: data ?? [] }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch FAQs';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new FAQ (admin-only)
export async function POST(request: NextRequest) {
  const supabase = createSupabaseClient(request);
  try {
    const { question, answer, category } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert([{ question, answer, category }])
      .select('id')
      .single();

    if (error) throw error; // RLS will throw an error if user is not admin

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create FAQ';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an existing FAQ (admin-only)
export async function PUT(request: NextRequest) {
  const supabase = createSupabaseClient(request);
  try {
    const { id, question, answer, category } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('faqs')
      .update({ question, answer, category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error; // RLS will throw an error if user is not admin

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update FAQ';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete an FAQ (admin-only)
export async function DELETE(request: NextRequest) {
  const supabase = createSupabaseClient(request);
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('faqs').delete().eq('id', id);

    if (error) throw error; // RLS will throw an error if user is not admin

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete FAQ';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
