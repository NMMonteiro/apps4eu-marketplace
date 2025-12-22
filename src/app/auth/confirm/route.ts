import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const redirect_to = searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            console.log('User verified successfully:', data.user?.email)
            const origin = new URL(request.url).origin
            // For Vercel production, we might need to enforce the correct domain
            const targetBase = process.env.NEXT_PUBLIC_SITE_URL || origin
            return NextResponse.redirect(`${targetBase}${redirect_to}`)
        } else {
            console.error('Verification error:', error.message)
        }
    }

    // return the user to an error page with some instructions
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/login?error=confirmation-failed`)
}
