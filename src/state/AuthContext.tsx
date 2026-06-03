import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

export type Profile = {
  id: string
  org_id: string | null
  role: 'owner' | 'admin' | 'member'
  display_name: string | null
}

type AuthValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data } = await getSupabase()
    .from('profiles')
    .select('id, org_id, role, display_name')
    .eq('id', userId)
    .maybeSingle()
  return (data as Profile | null) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const supabase = getSupabase()
    let alive = true

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session)
      if (!data.session) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!alive) return
      setSession(next)
      if (!next) {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let alive = true
    setLoading(true)
    loadProfile(userId)
      .then((p) => {
        if (alive) setProfile(p)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [userId])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signOut: async () => {
        if (isSupabaseConfigured) await getSupabase().auth.signOut()
      },
      refreshProfile: async () => {
        if (userId) setProfile(await loadProfile(userId))
      },
    }),
    [session, profile, loading, userId],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
