'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(email: string, password: string) {
    console.log('Attempting login for:', email)
    console.log('--- DEBUG INFO ---')
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log('Supabase URL:', sbUrl)
    console.log('Supabase Anon Key (Length):', sbKey?.length || 0)
    console.log('-------------------')

    if (!email || !password) {
        return { error: 'Please enter both email and password.' }
    }

    let shouldRedirect = false

    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://example.com') {
            console.error('CRITICAL: Supabase URL is not configured or is default.')
            return { error: 'Server configuration error: Supabase URL missing.' }
        }

        const supabase = await createClient()

        console.log('Attempting Supabase SignIn...')
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
    console.log('--- DEBUG SIGNUP START ---')
    console.log('Email:', JSON.stringify(email))
    console.log('Password Length:', password?.length || 0)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('--------------------')

    if (!email || !password) {
        return { error: 'Email and password are required for sign up.' }
    }

    try {
        const supabase = await createClient()

        console.log('Attempting Supabase SignUp...')
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error('Supabase Signup Error DETAILS:', JSON.stringify(error))
            return { error: `${error.message} (Code: ${error.status})` }
        }

        console.log('Signup Successful for:', data.user?.id)
        return { success: true }
    } catch (err) {
        console.error('CRITICAL Exception during Signup:', err)
        if (err instanceof Error) {
            console.error('Error Stack:', err.stack)
            return { error: `System Error: ${err.message}` }
        }
        return { error: 'Unexpected system error during signup.' }
    }
}
