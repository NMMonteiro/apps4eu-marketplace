import { prisma } from '@/lib/prisma'
import HomeHero from '@/components/home/HomeHero'
import ProductCard from '@/components/marketplace/ProductCard'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const rawProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  const products = (rawProducts as any[]).map(p => ({
    ...p,
    price: Number(p.price),
    price1m: p.price1m ? Number(p.price1m) : null,
    price12m: p.price12m ? Number(p.price12m) : null,
    price24m: p.price24m ? Number(p.price24m) : null,
  }))

  return (
    <div>
      <HomeHero />

      {/* Trust Bar */}
      <div className="bg-white border-b py-8 relative z-20">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale">
          <span className="font-black text-xl tracking-tighter">EUROSTAT</span>
          <span className="font-black text-xl tracking-tighter">DG CONNECT</span>
          <span className="font-black text-xl tracking-tighter">ERASMUS+</span>
          <span className="font-black text-xl tracking-tighter">HORIZON EU</span>
        </div>
      </div>

      {/* Marketplace Section preview */}
      <section id="marketplace" className="py-32 bg-slate-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 tracking-tight">The Marketplace</h2>
            <p className="text-brand-slate max-w-2xl text-lg md:text-xl font-medium">
              Immediate access to enterprise-grade frameworks, automated infrastructure, and European-compliant distribution tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border border-dashed rounded-3xl">
                <p className="text-brand-slate italic">New frameworks arriving soon.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="mt-20 text-center">
            <a href="/marketplace" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-navy text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-brand-navy/20">
              Explore Full Catalog
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
