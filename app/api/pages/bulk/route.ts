import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    const { error } = await supabase
      .from('pages')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Failed to delete pages' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { ids, action, value } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (action === 'publish') {
      updateData.is_published = value;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error } = await supabase
      .from('pages')
      .update(updateData)
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: 'Failed to update pages' }, { status: 500 });
  }
}
