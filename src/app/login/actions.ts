'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(email: string, password: string) {
    console.log('Attempting login for:', email)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    console.log('Supabase URL (Config):', supabaseUrl)

    try {
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Supabase Login Error:', error)
            return { error: error.message }
        }

        redirect('/dashboard')
    } catch (err) {
        console.error('Unexpected Login Error:', err)
        return { error: 'Unexpected system error. Check server logs.' }
    }
}

export async function signup(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
