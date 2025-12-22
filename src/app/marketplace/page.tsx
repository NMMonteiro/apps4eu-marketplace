
import { prisma } from '@/lib/prisma'
import { ShoppingBag, Sparkles, LayoutGrid, Zap } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/marketplace/ProductCard'

import MarketplaceHero from '@/components/marketplace/MarketplaceHero'

export const dynamic = 'force-dynamic'

export default async function MarketplacePage() {
    const rawProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const products = (rawProducts as any[]).map(p => ({
        ...p,
        price: Number(p.price),
        price1m: p.price1m ? Number(p.price1m) : null,
        price12m: p.price12m ? Number(p.price12m) : null,
        price24m: p.price24m ? Number(p.price24m) : null,
    }))

    const categories = ['All', ...new Set(products.map(p => p.category || 'General'))]

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <MarketplaceHero />

            {/* Filtering & Layout Header */}
            <div className="container mx-auto px-4 relative z-20 -mt-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${cat === 'All'
                                    ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/20'
                                    : 'text-brand-slate hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-brand-slate">
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border">
                            <button className="p-1.5 rounded bg-white shadow-sm text-brand-navy"><LayoutGrid className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded hover:bg-white transition-colors "><Zap className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-4 mt-12">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy">Looking for treasures?</h3>
                        <p className="text-brand-slate">Store items are arriving soon. Stay tuned!</p>
                        <Link href="/dashboard" className="mt-6 inline-block text-brand-navy font-bold hover:underline">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )
                }
            </div>
        </div>
    )
}
