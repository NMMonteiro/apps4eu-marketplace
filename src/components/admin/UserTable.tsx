'use client'

import { useState } from 'react'
import { updateUserRole, deleteUser } from '@/app/admin/user-actions'
import { User, Shield, ShieldOff, Trash2, Search, Loader2 } from 'lucide-react'

interface UserData {
    id: string
    email?: string
    app_metadata: any
    created_at: string
}

export default function UserTable({ initialUsers }: { initialUsers: UserData[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState<string | null>(null)

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    const handleToggleRole = async (userId: string, currentIsAdmin: boolean) => {
        setLoading(userId)
        const result = await updateUserRole(userId, !currentIsAdmin)
        if (result.success) {
            setUsers(users.map(u =>
                u.id === userId
                    ? { ...u, app_metadata: { ...u.app_metadata, role: !currentIsAdmin ? 'admin' : 'user' } }
                    : u
            ))
        }
        setLoading(null)
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

        setLoading(userId)
        const result = await deleteUser(userId)
        if (result.success) {
            setUsers(users.filter(u => u.id !== userId))
        }
        setLoading(null)
    }

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                    <User className="w-5 h-5" />
                    User Management
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-1.5 border rounded-lg text-sm bg-white focus:ring-1 focus:ring-brand-navy outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b text-sm font-semibold text-brand-navy uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {filteredUsers.map((user) => {
                            const isAdmin = user.app_metadata?.role === 'admin'
                            const isSelf = false // Logic for current user ID could be added if available

                            return (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-brand-navy">{user.email}</div>
                                        <div className="text-[10px] font-mono text-brand-slate truncate max-w-[150px]">{user.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {isAdmin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-brand-slate">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleRole(user.id, isAdmin)}
                                                disabled={loading === user.id}
                                                className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                                title={isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                            >
                                                {loading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />)}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={loading === user.id}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                {loading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-brand-slate italic">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
