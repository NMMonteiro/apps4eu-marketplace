
import { prisma } from '@/lib/prisma'
import { ShoppingBag, Sparkles, LayoutGrid, Zap } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/marketplace/ProductCard'

export const dynamic = 'force-dynamic'

export default async function MarketplacePage() {
    const rawProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const products = rawProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }))

    const categories = ['All', ...new Set(products.map(p => p.category || 'General'))]

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-brand-navy text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-600 blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 border border-white/10">
                        <Sparkles className="w-4 h-4" />
                        Premium App Marketplace
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Power your projects with <br />
                        <span className="text-blue-400">Next-Gen Webapps.</span>
                    </h1>
                    <p className="text-blue-100/60 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                        Secure access to enterprise-grade tools, AI engines, and management platforms for European projects.
                    </p>
                </div>
            </div>

            {/* Filtering & Layout Header */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl border p-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
