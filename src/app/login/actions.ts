'use server'

import { createClient } from '@/lib/supabase/server'
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
    console.log('--- CUSTOM SIGNUP START ---')

    if (!email || !password) {
        return { error: 'Email and password are required for sign up.' }
    }

    try {
        const supabase = await createClient()

        // 1. Create the user in Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            console.error('Supabase Signup Error:', signUpError.message)
            return { error: `${signUpError.message} (Code: ${signUpError.status})` }
        }

        if (data.user) {
            try {
                // 2. Fetch the custom template
                const template = await prisma.emailTemplate.findUnique({
                    where: { slug: 'signup-confirmation' }
                })

                if (template) {
                    // 3. Generate confirmation link (requires Service Role Key)
                    const headerList = await headers()
                    const host = headerList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL
                    const redirectTo = `${host}/auth/callback`

                    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                        type: 'signup',
                        email: email,
                        password: password,
                        options: { redirectTo }
                    })

                    if (linkError) {
                        console.error('Error generating link:', linkError.message)
                    } else {
                        // 4. Send Custom Branded Email via Resend
                        const html = template.body
                            .replace('{{email}}', email)
                            .replace('{{link}}', linkData.properties.action_link)

                        await resend.emails.send({
                            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                            to: email,
                            subject: template.subject,
                            html: html,
                        })
                        console.log('Custom branded email sent via Resend')
                    }
                }
            } catch (emailErr) {
                console.error('Error sending custom email (falling back to default):', emailErr)
            }
        }

        console.log('Signup Process Complete')
        return { success: true }
    } catch (err) {
        console.error('CRITICAL Exception during Signup:', err)
        if (err instanceof Error) {
            return { error: `System Error: ${err.message}` }
        }
        return { error: 'Unexpected system error during signup.' }
    }
}
