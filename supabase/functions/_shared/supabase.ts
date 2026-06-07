import { createClient, type User } from 'npm:@supabase/supabase-js@2'

const URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

// Privileged client (bypasses RLS) — only ever used server-side here.
export const admin = () => createClient(URL, SERVICE_KEY, { auth: { persistSession: false } })

// Resolve the caller from their JWT (Authorization header).
export async function getUser(req: Request): Promise<User | null> {
  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader) return null
  const client = createClient(URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  })
  const { data } = await client.auth.getUser()
  return data.user
}
