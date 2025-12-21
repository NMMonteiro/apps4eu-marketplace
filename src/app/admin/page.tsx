import { prisma } from '@/lib/prisma'
import { Plus, Settings, Box, Database, DollarSign } from 'lucide-react'
import { revalidatePath } from 'next/cache'

async function addProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const s3Path = formData.get('s3_path') as string

    await prisma.product.create({
        data: {
            name,
            description,
            price: parseFloat(price),
            s3_file_path: s3Path
        }
    })

    revalidatePath('/admin')
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const transactions = await prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Admin Suite</h1>
                    <p className="text-brand-slate">System management and product distribution.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        Config
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Management */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2 font-semibold text-brand-navy">
                                <Box className="w-5 h-5" />
                                Product List
                            </div>
                        </div>
                        <div className="divide-y">
                            {products.length === 0 ? (
                                <div className="p-12 text-center text-brand-slate">No products in database.</div>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div>
                                            <div className="font-medium text-brand-navy">{product.name}</div>
                                            <div className="text-sm text-brand-slate">${product.price.toString()} • {product.s3_file_path || 'No file path'}</div>
                                        </div>
                                        <button className="text-xs font-medium text-brand-navy hover:underline text-slate-400">Edit</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add New Product
                        </h3>
                        <form action={addProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Product Name</label>
                                    <input name="name" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Price (USD)</label>
                                    <input name="price" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Description</label>
                                <textarea name="description" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none resize-none" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">S3 File Path</label>
                                <input name="s3_path" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="vault/apps/product_v1.zip" />
                            </div>
                            <button type="submit" className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-colors font-medium">
                                Create Product
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-brand-navy text-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-6 flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            System Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-2xl font-bold">{products.length}</div>
                                <div className="text-xs opacity-60">Total Active Products</div>
                            </div>
                            <div className="h-[1px] bg-white/10" />
                            <div>
                                <div className="text-2xl font-bold">${transactions.reduce((acc, t) => acc + Number(t.amount), 0).toFixed(2)}</div>
                                <div className="text-xs opacity-60">Recent Revenue (Last 5)</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-slate mb-4 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Recent Sales
                        </h3>
                        <div className="space-y-4">
                            {transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-brand-slate truncate max-w-[100px]">{t.paymentIntentId}</span>
                                    <span className="text-xs font-bold text-brand-navy">${t.amount.toString()}</span>
                                </div>
                            ))}
                            {transactions.length === 0 && <span className="text-xs text-brand-slate italic">No recent sales</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
