import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();

    // Validate required fields
    if (!leadData.business_basics?.contact_person && !leadData.contact_info?.preferred_contact) {
      return NextResponse.json({ error: 'Contact information is required' }, { status: 400 });
    }

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }

    // Log analytics event
    await supabase.from('analytics_events').insert({
      event_type: 'lead_created',
      event_data: {
        lead_id: data.id,
        source: 'chatbot_live_agent',
        contact_method: leadData.contact_info?.preferred_contact
      },
      page_url: leadData.source_url,
      user_agent: req.headers.get('user-agent') || undefined,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    });

    return NextResponse.json({
      success: true,
      lead: data,
      message: 'Lead created successfully. An agent will contact you soon.'
    });

  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
