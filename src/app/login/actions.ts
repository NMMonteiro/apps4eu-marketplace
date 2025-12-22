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
    const DEPLOY_VERS = "v2.0-FINAL-CHECK"
    console.log(`--- [${DEPLOY_VERS}] CLEAN SIGNUP START ---`)

    if (!email || !password) {
        return { error: 'Email and password are required for sign up.' }
    }

    try {
        const headerList = await headers()
        const host = headerList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL
        const supabase = await createAdminClient()

        // 0. DIAGNOSTIC: Test Admin API connectivity
        const { error: testErr, data: testData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
        console.log('--- ADMIN API CONNECTIVITY TEST ---')
        console.log('listUsers error:', testErr ? `${testErr.message} (${testErr.status})` : 'NONE (Success)')

        // DEBUG: Check Service Role Keys (Safe Logging)
        const srKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const adminKey = process.env.ADMIN_SERVICE_ROLE_KEY
        console.log('SUPABASE_SERVICE_ROLE_KEY Present:', !!srKey, 'Len:', srKey?.length || 0)
        console.log('ADMIN_SERVICE_ROLE_KEY Present:', !!adminKey, 'Len:', adminKey?.length || 0)

        const debugInfo = `| SR=${!!srKey}(${srKey?.length}) ADM=${!!adminKey}(${adminKey?.length}) | TEST=${testErr ? testErr.status : 'OK'} | URL=${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15)}...`
        console.log('-------------------------------')

        // 1. Create the user using ADMIN API (auto-confirm for now to bypass hurdles)
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            app_metadata: { role: 'user' }
        })

        if (createError) {
            console.error('Supabase Admin Create Error (FULL):', JSON.stringify(createError, null, 2))

            if (createError.message.includes('not allowed') || createError.status === 401) {
                console.log('Admin signup blocked. Trying fallback to public signUp...')
                const publicSupabase = await createClient()
                const { data: pubData, error: pubError } = await publicSupabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${host}/auth/callback`,
                    }
                })

                if (pubError) {
                    return { error: `Signup failed: ${pubError.message}` }
                }

                return {
                    success: true,
                    message: 'Account created! Please check your email for a confirmation link.'
                }
            }

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
                    console.log('Email template found, generating link...')
                    const redirectTo = `${host}/auth/confirm`

                    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                        type: 'signup',
                        email: email,
                        password: password,
                        options: { redirectTo }
                    })

                    if (linkError) {
                        console.error('Error generating link:', linkError.message)
                    } else {
                        const confirmLink = `${host}/auth/confirm?token_hash=${linkData.properties.hashed_token}&type=signup`
                        console.log('Sending branded email via Resend to:', email)

                        const resendResult = await resend.emails.send({
                            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                            to: email,
                            subject: template.subject,
                            html: template.body.replace('{{email}}', email).replace('{{link}}', confirmLink),
                        })

                        if (resendResult.error) {
                            console.error('Resend API Error:', resendResult.error)
                        } else {
                            console.log('Resend success! ID:', resendResult.data?.id)
                        }
                    }
                } else {
                    console.log('No "signup-confirmation" template found in database.')
                }
            } catch (emailErr) {
                console.error('CRITICAL Error in post-signup email flow:', emailErr)
            }
        }

        return { success: true }
    } catch (err) {
        console.error('CRITICAL Exception during Signup:', err)
        return { error: 'Unexpected system error during signup.' }
    }
}
