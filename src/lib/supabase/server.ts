import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://example.com'),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
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
        }
    )
}

/**
 * Administrative client for privileged operations (bypasses RLS, allows Auth Admin API)
 * CRITICAL: Use ONLY in server-side contexts where you trust the operation.
 */
export async function createAdminClient() {
    return createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://example.com'),
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
        {
            cookies: {
                getAll() { return [] },
                setAll() { },
            },
        }
    )
}
