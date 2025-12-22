'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function login(email: string, password: string) {
    if (!email || !password) {
        return { error: 'Please enter both email and password.' }
    }

    let shouldRedirect = false

    try {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Supabase Login Error:', error.message, error.status)
            return { error: `${error.message} (Code: ${error.status})` }
        }

        console.log('Login Successful, Session created for:', data.user?.id)
        shouldRedirect = true
    } catch (err) {
        console.error('Unexpected Exception during Login:', err)
        if (err instanceof Error) {
            return { error: `System Error: ${err.message}` }
        }
        return { error: 'Unexpected system error. Check server logs.' }
    }

    if (shouldRedirect) {
        redirect('/dashboard')
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function signup(email: string, password: string) {
    console.log('--- CLEAN SIGNUP START (Admin-led) ---')

    if (!email || !password) {
        return { error: 'Email and password are required for sign up.' }
    }

    try {
        const supabase = await createAdminClient()

        // DEBUG: Check Service Role Key (Safe Logging)
        const srKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        console.log('--- DEBUG: Service Role Key Info ---')
        console.log('Key Present:', !!srKey)
        console.log('Key Length:', srKey?.length || 0)
        if (srKey && srKey.length > 10) {
            console.log('Key Sample:', srKey.substring(0, 5) + '...' + srKey.substring(srKey.length - 5))
        }
        console.log('------------------------------------')

        // 1. Create the user using ADMIN API (this bypasses auto-emails and gives us control)
        // We set email_confirm: false so they still need to verify via our link.
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
            app_metadata: { role: 'user' }
        })

        if (createError) {
            console.error('Supabase Admin Create Error:', createError.message)
            // If user already exists, Supabase returns a specific error
            if (createError.message.includes('already registered')) {
                return { error: 'This email is already registered. Please log in.' }
            }
            return { error: `Signup failed: ${createError.message}` }
        }

        if (userData.user) {
            try {
                // 2. Fetch the custom template
                const template = await prisma.emailTemplate.findUnique({
                    where: { slug: 'signup-confirmation' }
                })

                if (template) {
                    // 3. Generate confirmation link
                    const headerList = await headers()
                    const host = headerList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL
                    const redirectTo = `${host}/auth/confirm` // Note: Constructing the link manually with /auth/confirm

                    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                        type: 'signup',
                        email: email,
                        password: password,
                        options: { redirectTo }
                    })

                    if (linkError) {
                        console.error('Error generating link:', linkError.message)
                    } else {
                        // 4. Construct our OWN link that points to our SECURE routing
                        const confirmLink = `${host}/auth/confirm?token_hash=${linkData.properties.hashed_token}&type=signup`

                        // 5. Send ONE Branded Email via Resend
                        await resend.emails.send({
                            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                            to: email,
                            subject: template.subject,
                            html: template.body.replace('{{email}}', email).replace('{{link}}', confirmLink),
                        })
                        console.log('Single branded email sent via Resend')
                    }
                }
            } catch (emailErr) {
                console.error('Error in post-signup email flow:', emailErr)
            }
        }

        return { success: true }
    } catch (err) {
        console.error('CRITICAL Exception during Signup:', err)
        return { error: 'Unexpected system error during signup.' }
    }
}
