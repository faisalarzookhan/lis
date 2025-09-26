import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { method } = req

  if (method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  const { ids } = await req.json()

  if (!ids || !Array.isArray(ids)) {
    return new Response(JSON.stringify({ error: 'ids array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch entries without embeddings
  const { data: entries, error: fetchError } = await supabaseClient
    .from('knowledge_base')
    .select('id, content')
    .in('id', ids)
    .is('embedding', null)

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!entries || entries.length === 0) {
    return new Response(JSON.stringify({ message: 'No entries to process' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Generate embeddings using OpenAI
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const embeddings = []
  for (const entry of entries) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: entry.content,
          model: 'text-embedding-ada-002',
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      embeddings.push({
        id: entry.id,
        embedding: data.data[0].embedding,
      })
    } catch (error) {
      console.error(`Error generating embedding for ${entry.id}:`, error)
    }
  }

  // Update the database with embeddings
  for (const item of embeddings) {
    await supabaseClient
      .from('knowledge_base')
      .update({ embedding: item.embedding })
      .eq('id', item.id)
  }

  return new Response(JSON.stringify({
    message: `Generated embeddings for ${embeddings.length} entries`
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
