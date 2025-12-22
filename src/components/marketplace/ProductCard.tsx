'use client'

import { Product } from '@prisma/client'
import { ArrowUpRight, Zap, Star, ShieldCheck, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createCheckoutSession } from '@/app/marketplace/store-actions'
import { useState } from 'react'

interface ProductCardProps {
    product: any
}

export default function ProductCard({ product }: ProductCardProps) {
    const [loading, setLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<'1m' | '12m' | '24m' | 'lifetime'>(
        product.billingType === 'SUBSCRIPTION' ? '1m' : 'lifetime'
    )

    const handlePurchase = async () => {
        setLoading(true)
        try {
            const result = await createCheckoutSession(product.id, selectedPlan)
            if (result?.error) {
                alert(result.error)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const currentPrice = () => {
        if (selectedPlan === '1m') return product.price1m?.toString() || '0'
        if (selectedPlan === '12m') return product.price12m?.toString() || '0'
        if (selectedPlan === '24m') return product.price24m?.toString() || '0'
        return product.price.toString()
    }

    return (
        <div className="group relative bg-white rounded-3xl border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Image Placeholder/Visual */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden shrink-0">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <Zap className="w-12 h-12 text-brand-navy/20 relative animate-pulse" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-navy border shadow-sm">
                        {product.category || 'General'}
                    </span>
                    {product.billingType === 'SUBSCRIPTION' && (
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500 shadow-sm">
                            Subscription
                        </span>
                    )}
                </div>

                {/* Try Demo Button - Overlay */}
                <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <a
                        href={`/marketplace/demo/${product.id}`}
                        className="px-6 py-2 bg-white text-brand-navy rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-slate-50 active:scale-95"
                    >
                        Try Live Demo
                    </a>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-brand-navy leading-tight group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">4.9</span>
                    </div>
                </div>

                <p className="text-brand-slate text-sm line-clamp-2 mb-4">
                    {product.description || 'Access powerful tools designed for European project success.'}
                </p>

                {/* Plan Selector for Subscriptions */}
                {product.billingType === 'SUBSCRIPTION' && (
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-xl mb-4 text-[10px] font-bold">
                        <button
                            onClick={() => setSelectedPlan('1m')}
                            className={`py-1.5 rounded-lg transition-all ${selectedPlan === '1m' ? 'bg-white text-brand-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-brand-navy'}`}
                        >
                            1 Month
                        </button>
                        <button
                            onClick={() => setSelectedPlan('12m')}
                            className={`relative py-1.5 rounded-lg transition-all ${selectedPlan === '12m' ? 'bg-white text-brand-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-brand-navy'}`}
                        >
                            12 Months
                            {Number(product.price1m) > 0 && Number(product.price12m) > 0 && (
                                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[7px] px-1 rounded-full animate-pulse">
                                    -{Math.round((1 - (Number(product.price12m) / (Number(product.price1m) * 12))) * 100)}%
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setSelectedPlan('24m')}
                            className={`relative py-1.5 rounded-lg transition-all ${selectedPlan === '24m' ? 'bg-white text-brand-navy shadow-sm border border-slate-200' : 'text-slate-400 hover:text-brand-navy'}`}
                        >
                            24 Months
                            {Number(product.price1m) > 0 && Number(product.price24m) > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] px-1 rounded-full">
                                    -{Math.round((1 - (Number(product.price24m) / (Number(product.price1m) * 24))) * 100)}%
                                </span>
                            )}
                        </button>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-brand-slate uppercase tracking-widest block mb-0.5">
                            {selectedPlan === 'lifetime' ? 'One-time Payment' : (
                                selectedPlan === '1m' ? 'Monthly Billing' :
                                    selectedPlan === '12m' ? 'Annual Billing' : '2-Year Billing'
                            )}
                        </span>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-brand-navy">€{currentPrice()}</span>
                            <span className="text-xs font-medium text-brand-slate mb-1">
                                {selectedPlan === '1m' ? '/mo' : selectedPlan === '12m' ? '/yr' : selectedPlan === '24m' ? '/2yrs' : 'EUR'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-slate-50/50 px-6 py-3 flex items-center gap-2 border-t">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-bold text-brand-slate uppercase tracking-tighter">Verified European SaaS</span>
            </div>
        </div>
    )
}
