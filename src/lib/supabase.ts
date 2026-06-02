import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anon)

let client: SupabaseClient | null = null

// Lazy: a missing .env must not crash the static site. The client is only
// constructed (and validated) the first time a data-backed feature asks for it.
export function getSupabase(): SupabaseClient {
  if (!url || !anon) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).',
    )
  }
  if (!client) client = createClient(url, anon)
  return client
}
