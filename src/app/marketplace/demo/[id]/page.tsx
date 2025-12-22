import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, ShoppingCart, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface DemoPageProps {
    params: Promise<{ id: string }>
}

export default async function DemoPage({ params }: DemoPageProps) {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id }
    })

    if (!product || !product.appUrl) {
        notFound()
    }

    return (
        <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
            {/* Demo Header */}
            <div className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/marketplace" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-brand-slate">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-8 w-px bg-slate-100" />
                    <div>
                        <h1 className="font-bold text-brand-navy flex items-center gap-2">
                            Demo Mode: <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{product.name}</span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-[10px] text-brand-slate font-medium">
                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                            Limitations Active: Export/Print/Copy Disabled
                        </div>
                    </div>
                </div>

                <Link
                    href="/marketplace"
                    className="flex items-center gap-2 px-6 py-2 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navy-light transition-all shadow-lg shadow-brand-navy/20 active:scale-95"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Get Full Access
                </Link>
            </div>

            {/* Iframe Container with Restrictions */}
            <div className="flex-grow relative bg-slate-800">
                <iframe
                    src={product.appUrl}
                    className="w-full h-full border-none select-none"
                    title={`Demo - ${product.name}`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />

                {/* Security Overlays */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body { display: none !important; }
                    }
                    .no-select {
                        user-select: none !important;
                        -webkit-user-select: none !important;
                    }
                `}} />

                <script dangerouslySetInnerHTML={{
                    __html: `
                    document.addEventListener('contextmenu', e => e.preventDefault());
                    document.addEventListener('keydown', e => {
                        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 's')) {
                            e.preventDefault();
                            alert('Actions are disabled in Demo Mode. Purchase a license to unlock full features!');
                        }
                    });
                `}} />
            </div>

            {/* Bottom Bar / Status */}
            <div className="h-10 bg-slate-900 px-6 flex items-center justify-center gap-4 border-t border-white/5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Apps4EU Projects Demo Environment</span>
            </div>
        </div>
    )
}
