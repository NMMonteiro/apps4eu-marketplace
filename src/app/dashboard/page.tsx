import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Download, Key, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const licenses = await prisma.license.findMany({
        where: { userId: user.id },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-navy">My Purchased Products</h1>
                <p className="text-brand-slate">Manage your digital assets and license keys.</p>
            </div>

            {licenses.length === 0 ? (
                <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
                    <Package className="w-12 h-12 mx-auto text-brand-slate mb-4 opacity-20" />
                    <h2 className="text-xl font-medium text-brand-navy">No products found</h2>
                    <p className="text-brand-slate mt-2">Any products you purchase will appear here.</p>
                    <a
                        href="/"
                        className="inline-block mt-6 px-6 py-2 bg-brand-navy text-white rounded-md hover:bg-brand-navy-light transition-colors"
                    >
                        Browse Marketplace
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {licenses.map((license) => (
                        <div key={license.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-brand-navy/5 rounded-lg">
                                    <Package className="w-6 h-6 text-brand-navy" />
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${license.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {license.status.toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-brand-navy mb-1 line-clamp-1">
                                {license.product.name}
                            </h3>
                            <p className="text-sm text-brand-slate mb-6 line-clamp-2">
                                {license.product.description}
                            </p>

                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Key className="w-3.5 h-3.5 text-brand-navy" />
                                        <span className="text-[10px] uppercase font-bold text-brand-slate tracking-wider">License Key</span>
                                    </div>
                                    <code className="text-xs font-mono text-brand-navy block truncate">
                                        {license.licenseKey}
                                    </code>
                                </div>

                                <button
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-all active:scale-[0.98]"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="text-sm font-medium">Download Now</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
