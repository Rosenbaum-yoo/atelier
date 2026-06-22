import { getSupabase } from '../lib/supabase'

export type PendingVerification = {
  id: string
  org_id: string
  kind: 'seller' | 'revenue'
  listing_id: string | null
  note: string | null
  created_at: string
}

// Is the current user platform staff? platform_staff RLS ("read self") returns the
// caller's own row iff they are on the allowlist — so a non-staff user simply gets
// nothing. The real authority gate lives server-side in the verification-review
// Edge Function; this only drives the Staff-Center UI.
export async function fetchIsStaff(): Promise<boolean> {
  const { data: auth } = await getSupabase().auth.getUser()
  const uid = auth.user?.id
  if (!uid) return false
  const { data } = await getSupabase()
    .from('platform_staff').select('user_id').eq('user_id', uid).maybeSingle()
  return !!data
}

// All open requests across every org. verification_requests RLS ("read staff")
// returns the global queue only for staff; a non-staff caller would see just their
// own org's rows, so the page is additionally gated by fetchIsStaff().
export async function fetchPendingVerifications(): Promise<PendingVerification[]> {
  const { data, error } = await getSupabase()
    .from('verification_requests')
    .select('id, org_id, kind, listing_id, note, created_at')
    .in('status', ['pending', 'reviewing'])
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as PendingVerification[]) ?? []
}

export async function reviewVerification(
  requestId: string,
  decision: 'approved' | 'rejected',
  reviewNote?: string,
): Promise<void> {
  const { error } = await getSupabase().functions.invoke('verification-review', {
    body: { requestId, decision, reviewNote },
  })
  if (error) {
    let msg = error.message
    const ctx = (error as { context?: Response }).context
    if (ctx && typeof ctx.json === 'function') {
      const parsed = await ctx.json().catch(() => null)
      if (parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error)
        msg = String((parsed as { error: unknown }).error)
    }
    throw new Error(msg)
  }
}
