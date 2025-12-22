
import { Product } from '@prisma/client'
import { ArrowUpRight, Zap, Star, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
    product: any // Using any briefly due to decimal type conflicts, will refine
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative bg-white rounded-3xl border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Image Placeholder/Visual */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-full bg-brand-navy/5 blur-xl group-hover:bg-brand-navy/10 transition-colors" />
                            <Zap className="w-12 h-12 text-brand-navy/20 relative animate-pulse" />
                        </div>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-navy border shadow-sm">
                        {product.category || 'General'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-brand-navy leading-tight group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">4.9</span>
                    </div>
                </div>

                <p className="text-brand-slate text-sm line-clamp-2 mb-6 min-h-[40px]">
                    {product.description || 'Access powerful tools designed for European project success.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                        <span className="text-xs font-bold text-brand-slate uppercase tracking-widest block mb-0.5">Lifetime Access</span>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-brand-navy">${Number(product.price).toString()}</span>
                            <span className="text-xs font-medium text-brand-slate mb-1">USD</span>
                        </div>
                    </div>

                    <button className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all duration-300 shadow-sm">
                        <ArrowUpRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-slate-50/50 px-6 py-3 flex items-center gap-2 border-t">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-bold text-brand-slate uppercase tracking-tighter">Secure SaaS Access</span>
            </div>
        </div>
    )
}
