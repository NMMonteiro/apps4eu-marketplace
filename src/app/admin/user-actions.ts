'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * List all users from Supabase Auth (Admin API)
 */
export async function listUsers() {
    try {
        const supabase = await createClient()
        const { data: { users }, error } = await supabase.auth.admin.listUsers()

        if (error) throw error
        return { users: users || [] }
    } catch (err) {
        console.error('Error listing users:', err)
        return { error: 'Failed to fetch users', users: [] }
    }
}

/**
 * Update user role/metadata
 */
export async function updateUserRole(userId: string, isAdmin: boolean) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.admin.updateUserById(userId, {
            app_metadata: { role: isAdmin ? 'admin' : 'user' }
        })

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('Error updating user role:', err)
        return { error: 'Failed to update user role' }
    }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.admin.deleteUser(userId)

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('Error deleting user:', err)
        return { error: 'Failed to delete user' }
    }
}

/**
 * Create a new user manually
 */
export async function createUser(email: string, password: string, isAdmin: boolean) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            app_metadata: { role: isAdmin ? 'admin' : 'user' }
        })

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('Error creating user:', err)
        return { error: err instanceof Error ? err.message : 'Failed to create user' }
    }
}
