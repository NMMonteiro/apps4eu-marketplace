import { prisma } from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/actions/checkout'
import { ShoppingCart, Star, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-24 border-b border-brand-navy-light">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-6 border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>Trusted by 500+ EU Projects</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            Premium Digital Solutions for <br />
            <span className="text-slate-400 underline decoration-slate-600 underline-offset-8">European Projects.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Secure, scalable, and compliant software architectures designed specifically for the unique requirements of apps4EUprojects.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#marketplace" className="px-8 py-3 bg-white text-brand-navy rounded-lg font-bold hover:bg-slate-100 transition-all">
              Explore Products
            </a>
            <a href="/admin" className="px-8 py-3 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-all">
              Admin Access
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4 flex justify-between items-center opacity-50 grayscale">
          <span className="font-bold text-lg">EUROSTAT</span>
          <span className="font-bold text-lg">DG CONNECT</span>
          <span className="font-bold text-lg">ERASMUS+</span>
          <span className="font-bold text-lg">HORIZON EU</span>
        </div>
      </div>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">The Marketplace</h2>
            <div className="h-1.5 w-20 bg-brand-navy rounded-full mb-6"></div>
            <p className="text-brand-slate text-center max-w-lg">
              Immediate access to high-quality codebases, UI kits, and distribution tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border rounded-2xl">
                <p className="text-brand-slate italic underline decoration-slate-200 underline-offset-4">No products currently available. Check back soon.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-navy transition-all hover:shadow-xl">
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-navy/5 flex items-center justify-center group-hover:bg-brand-navy/10 transition-colors">
                      <ShoppingCart className="w-12 h-12 text-brand-navy opacity-20" />
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-brand-navy">{product.name}</h3>
                      <span className="text-2xl font-black text-brand-navy">${product.price.toString()}</span>
                    </div>
                    <p className="text-brand-slate text-sm mb-6 line-clamp-2">
                      {product.description || 'No description provided for this premium asset.'}
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-xs font-semibold text-brand-navy/70">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Commercial Usage License
                      </li>
                      <li className="flex items-center gap-2 text-xs font-semibold text-brand-navy/70">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Immediate S3 Download
                      </li>
                    </ul>
                    <form action={async () => {
                      'use server'
                      await createCheckoutSession(product.id)
                    }}>
                      <button className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navy-light transition-all flex items-center justify-center gap-2">
                        Get Started <ShoppingCart className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
