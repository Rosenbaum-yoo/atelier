import { getSupabase } from '../lib/supabase'

export type Entitlement = {
  org_id: string
  stripe_account_id: string | null
  stripe_account_ready: boolean
  seller_verified: boolean
  revenue_verified: boolean
}

// Edge Functions return a JSON body even on error; surface its `error` field.
async function invoke<T>(name: string, body?: Record<string, unknown>): Promise<T> {
  const { data, error } = await getSupabase().functions.invoke(name, { body: body ?? {} })
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
  return data as T
}

export async function startCheckout(dealId: string): Promise<string> {
  const { url } = await invoke<{ url: string }>('checkout', { dealId })
  return url
}

export async function confirmRelease(dealId: string): Promise<void> {
  await invoke<{ ok: boolean }>('confirm-release', { dealId })
}

export async function startConnectOnboarding(): Promise<{ url?: string; ready?: boolean }> {
  return invoke<{ url?: string; ready?: boolean }>('connect-onboarding')
}

export async function fetchEntitlement(orgId: string): Promise<Entitlement | null> {
  const { data, error } = await getSupabase()
    .from('org_entitlements')
    .select('org_id, stripe_account_id, stripe_account_ready, seller_verified, revenue_verified')
    .eq('org_id', orgId)
    .maybeSingle()
  if (error) throw error
  return (data as Entitlement) ?? null
}
