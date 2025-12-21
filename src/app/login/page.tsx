'use client'

export const dynamic = 'force-dynamic'

import { login, signup } from './actions'
import { useState } from 'react'
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const result = await login(email, password)

        // If redirect happens in action, this code might not be reached or result is undefined
        // But if error returned:
        if (result?.error) {
            setMessage(result.error)
            setLoading(false)
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setMessage(null)

        const result = await signup(email, password)

        if (result?.error) {
            setMessage(result.error)
        } else {
            setMessage('Check your email for the confirmation link.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-navy tracking-tight">Access Your Portal</h1>
                    <p className="text-brand-slate mt-2">Enter your credentials to manage your licenses.</p>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="text-brand-slate hover:text-brand-navy flex items-center gap-2 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Marketplace
                        </Link>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-brand-navy ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-brand-navy ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('Check') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navy-light transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="mt-8 text-center text-sm text-brand-slate/60">
                            Don&apos;t have an account? <button onClick={handleSignUp} className="text-brand-navy font-semibold hover:underline">Create One</button>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-brand-slate font-medium uppercase tracking-widest">
                    Secure Infrastructure by apps4EUprojects
                </p>
            </div>
        </div>
    )
}
