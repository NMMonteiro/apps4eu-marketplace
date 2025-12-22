import { prisma } from '@/lib/prisma'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { updateProduct, deleteProduct } from '@/app/admin/product-actions'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params
    const rawProduct = await prisma.product.findUnique({
        where: { id }
    })

    if (!rawProduct) {
        notFound()
    }

    const product = {
        ...(rawProduct as any),
        billingType: (rawProduct as any).billingType,
        price: Number(rawProduct.price),
        price1m: (rawProduct as any).price1m ? Number((rawProduct as any).price1m) : null,
        price12m: (rawProduct as any).price12m ? Number((rawProduct as any).price12m) : null,
        price24m: (rawProduct as any).price24m ? Number((rawProduct as any).price24m) : null,
    }

    async function handleUpdate(formData: FormData) {
        'use server'
        await updateProduct(id, formData)
        redirect('/admin')
    }

    async function handleDelete() {
        'use server'
        await deleteProduct(id)
        redirect('/admin')
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-slate hover:text-brand-navy transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Suite
            </Link>

            <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-navy">Edit Product</h1>
                        <p className="text-brand-slate">Update details for {product.name}</p>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-8 shadow-sm">
                    <form action={handleUpdate} id="update-product-form" className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Product Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={product.name}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Default/Lifetime Price (EUR)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price.toString()}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Billing Type</label>
                                <select
                                    name="billing_type"
                                    defaultValue={product.billingType}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                >
                                    <option value="LIFETIME">Lifetime Access</option>
                                    <option value="SUBSCRIPTION">Subscription Based</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Category</label>
                                <input
                                    name="category"
                                    type="text"
                                    defaultValue={product.category || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                    placeholder="AI Tools, Business, etc."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Monthly (1m) Price</label>
                                <input
                                    name="price1m"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price1m?.toString() || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Annual (12m) Price</label>
                                <input
                                    name="price12m"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price12m?.toString() || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">2-Year (24m) Price</label>
                                <input
                                    name="price24m"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price24m?.toString() || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-navy">Description</label>
                            <textarea
                                name="description"
                                defaultValue={product.description || ''}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-navy">Thumbnail Image URL</label>
                            <input
                                name="image_url"
                                type="text"
                                defaultValue={product.imageUrl || ''}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-navy">Hosted App URL (Launch Link)</label>
                            <input
                                name="app_url"
                                type="text"
                                defaultValue={product.appUrl || ''}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                                placeholder="https://your-app.com"
                            />
                        </div>
                    </form>

                    <div className="pt-6 flex items-center justify-between border-t mt-6">
                        <form action={handleDelete}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Product
                            </button>
                        </form>
                        <button
                            type="submit"
                            form="update-product-form"
                            className="flex items-center gap-2 px-8 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-colors font-bold shadow-lg shadow-brand-navy/20"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
