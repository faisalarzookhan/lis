import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { method } = req

  if (method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // For simplicity, assume the file is text and contains knowledge entries
  const text = await file.text()
  const entries = text.split('\n\n').map(block => {
    const lines = block.split('\n')
    if (lines.length >= 1) {
      return {
        content: block.trim(),
        category: 'uploaded'
      }
    }
    return null
  }).filter(Boolean)

  const insertedIds = []
  for (const entry of entries) {
    if (entry) {
      const { data, error } = await supabaseClient
        .from('knowledge_base')
        .insert(entry)
        .select('id')
        .single()

      if (data) {
        insertedIds.push(data.id)
      }
    }
  }

  // Generate embeddings for new entries
  if (insertedIds.length > 0) {
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: insertedIds }),
      })
    } catch (error) {
      console.error('Error triggering embedding generation:', error)
    }
  }

  return new Response(JSON.stringify({ status: 'Knowledge uploaded', inserted: insertedIds.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
