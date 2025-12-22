import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // CRITICAL: We cannot use Supabase client-side because our instance is HTTP and the site is HTTPS.
    // This triggers "Mixed Active Content" errors.
    // All Supabase interactions MUST be done via Server Actions or Server Components.
    console.error('CRITICAL ERROR: createBrowserClient called. This is forbidden to prevent Mixed Content errors.')
    throw new Error('Client-side Supabase access is disabled. Use Server Actions.')
}
