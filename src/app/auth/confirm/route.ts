import { type EmailOtpType } from '@supabase/supabase-js'
import { next } from 'process'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const redirect_to = searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            const origin = new URL(request.url).origin
            // For Vercel production, we might need to enforce the correct domain
            const targetBase = process.env.NEXT_PUBLIC_SITE_URL || origin
            return NextResponse.redirect(`${targetBase}${redirect_to}`)
        }
    }

    // return the user to an error page with some instructions
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/login?error=confirmation-failed`)
}
