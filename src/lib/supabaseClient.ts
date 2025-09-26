import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Align with .env.local key: NEXT_PUBLIC_SUPABASE_DATABASE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env.local');
}

// Simple configuration with explicit public schema
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
})
