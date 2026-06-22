import { getSupabase } from '../lib/supabase'

export type VerificationKind = 'seller' | 'revenue'
export type VerificationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

export type VerificationRequest = {
  id: string
  kind: VerificationKind
  status: VerificationStatus
  review_note: string | null
  created_at: string
}

// Fordert eine Verifizierung an. Wir senden NUR `kind` — org_id, requester_id und
// der Anfangs-Status werden serverseitig vom set_verification_request_owner
// BEFORE-INSERT-Trigger (0005) erzwungen und per RLS doppelt abgesichert. Der
// Client wird nie vertraut, wer er ist oder wie der Ausgang lautet.
export async function requestVerification(kind: VerificationKind): Promise<void> {
  const { error } = await getSupabase().from('verification_requests').insert({ kind })
  if (error) throw error
}

// Die eigenen Anfragen der Org (RLS-scoped auf current_org_id()) — treibt den
// Dashboard-Status. Wir filtern NICHT per Client-org_id; RLS garantiert die Menge.
export async function fetchVerificationRequests(): Promise<VerificationRequest[]> {
  const { data, error } = await getSupabase()
    .from('verification_requests')
    .select('id, kind, status, review_note, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as VerificationRequest[]) ?? []
}
