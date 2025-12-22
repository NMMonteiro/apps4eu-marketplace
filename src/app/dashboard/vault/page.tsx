
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Package, ExternalLink, ShieldCheck, Clock, Layers } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AppVaultPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-brand-navy mb-2">Please Sign In</h2>
                    <p className="text-brand-slate mb-6">You need to be logged in to access your apps.</p>
                    <Link href="/login" className="px-6 py-2 bg-brand-navy text-white rounded-lg font-medium">Sign In</Link>
                </div>
            </div>
        )
    }

    // Fetch user's active licenses
    const rawLicenses = await prisma.license.findMany({
        where: { userId: user.id, status: 'active' },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
    })

    const licenses = rawLicenses.map(l => ({
        ...l,
        product: {
            ...l.product,
            price: Number(l.product.price)
        }
    }))

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
                        <Layers className="w-8 h-8 text-blue-500" />
                        My App Vault
                    </h1>
                    <p className="text-brand-slate mt-2">Manage and launch all your premium project apps from one secure location.</p>
                </div>

                {licenses.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed p-12 text-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">Your Vault is Empty</h2>
                        <p className="text-brand-slate max-w-md mx-auto mb-8">
                            Head over to the Marketplace to discover powerful apps and tools for your European projects.
                        </p>
                        <Link href="/marketplace" className="px-8 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navy-light transition-all shadow-lg shadow-brand-navy/20">
                            Explore Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {licenses.map((license) => (
                            <div key={license.id} className="bg-white rounded-3xl border p-8 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        Active License
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase">Verified</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-blue-600 transition-colors">
                                    {license.product.name}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-xs text-brand-slate font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        Purchased: {new Date(license.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-brand-slate font-medium truncate">
                                        <Package className="w-3.5 h-3.5" />
                                        Key: <span className="font-mono text-[10px] bg-slate-50 px-1.5 p-0.5 rounded">{license.licenseKey}</span>
                                    </div>
                                </div>

                                <a
                                    href={license.product.appUrl || '#'}
                                    target="_blank"
                                    className="w-full h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-brand-navy-light transition-all shadow-lg shadow-brand-navy/20 active:scale-95"
                                >
                                    Launch App
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
