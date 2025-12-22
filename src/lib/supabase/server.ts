import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com').replace(/\/$/, '')
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    })
}

/**
 * Administrative client for privileged operations (bypasses RLS, allows Auth Admin API)
 * CRITICAL: Use ONLY in server-side contexts where you trust the operation.
 */
export async function createAdminClient() {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com').replace(/\/$/, '')
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

    // For admin operations, we use the standard supabase-js client to avoid cookie/session overhead
    return createSupabaseClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
