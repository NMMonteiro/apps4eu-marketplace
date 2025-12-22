import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Settings, Box, Database, DollarSign, Mail, Users } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor'
import UserTable from '@/components/admin/UserTable'
import { listUsers } from '@/app/admin/user-actions'

const DEFAULT_SIGNUP_BODY = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h1 style="color: #0F172A; font-size: 24px;">Welcome to Apps4EU!</h1>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">
    Thanks for signing up for the Apps4EU Marketplace. Please click the button below to verify your email address and join our community.
  </p>
  <div style="margin: 30px 0; text-align: center;">
    <a href="{{link}}" style="background-color: #0F172A; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
      Confirm My Email
    </a>
  </div>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="color: #94A3B8; font-size: 12px; text-align: center;">
    If you didn't create an account, you can safely ignore this email.
  </p>
</div>
`

import { addProduct } from '@/app/admin/product-actions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
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

    const transactions = await prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })

    // Fetch or Seed Default Signup Confirmation Template
    let signupTemplate = await prisma.emailTemplate.findUnique({
        where: { slug: 'signup-confirmation' }
    })

    if (!signupTemplate) {
        signupTemplate = await prisma.emailTemplate.create({
            data: {
                slug: 'signup-confirmation',
                subject: 'Confirm your account for Apps4EU Marketplace',
                body: DEFAULT_SIGNUP_BODY
            }
        })
    }

    // Fetch Users from Supabase Auth
    const { users, error: userError } = await listUsers()

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
                {/* Main Management Area */}
                <div className="lg:col-span-2 space-y-12">
                    {/* User Management Section */}
                    <UserTable initialUsers={users} />

                    {/* Product Management */}
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
                                        <div className="flex-grow">
                                            <div className="font-medium text-brand-navy">{product.name}</div>
                                            <div className="text-sm text-brand-slate flex flex-wrap gap-x-3 items-center">
                                                <span>{product.category || 'General'}</span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className="font-bold text-brand-navy">
                                                    {product.billingType === 'SUBSCRIPTION'
                                                        ? `Sub: €${product.price1m}/€${product.price12m}/€${product.price24m}`
                                                        : `Lifetime: €${product.price}`
                                                    }
                                                </span>
                                                {product.appUrl && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold uppercase tracking-tighter">Live</span>}
                                            </div>
                                        </div>
                                        <Link href={`/admin/products/${product.id}/edit`} className="ml-4 px-3 py-1 text-xs font-bold text-brand-navy border rounded-lg hover:bg-white hover:shadow-sm transition-all">Edit</Link>
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
                                    <label className="text-sm font-medium text-brand-navy">Default/Lifetime Price (EUR)</label>
                                    <input name="price" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Billing Type</label>
                                    <select name="billing_type" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none">
                                        <option value="LIFETIME">Lifetime Access</option>
                                        <option value="SUBSCRIPTION">Subscription Based</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Monthly (1m) Price</label>
                                    <input name="price1m" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="Empty if not applicable" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Annual (12m) Price</label>
                                    <input name="price12m" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="Empty if not applicable" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">2-Year (24m) Price</label>
                                    <input name="price24m" type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="Empty if not applicable" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Description</label>
                                <textarea name="description" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none resize-none" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Category</label>
                                    <input name="category" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="AI Tools, Business, etc." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-navy">Thumbnail Image URL</label>
                                    <input name="image_url" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-navy">Hosted App URL (Launch Link)</label>
                                <input name="app_url" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none" placeholder="https://your-app.com" />
                            </div>
                            <button type="submit" className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-colors font-medium">
                                Create Product
                            </button>
                        </form>
                    </div>

                    {/* Email Template Management */}
                    <EmailTemplateEditor initialTemplate={signupTemplate} />
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
                                <div className="text-2xl font-bold">€{transactions.reduce((acc, t) => acc + Number(t.amount), 0).toFixed(2)}</div>
                                <div className="text-xs opacity-60">Recent Revenue (Last 5)</div>
                            </div>
                            <div className="h-[1px] bg-white/10" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs opacity-60">Registered Users</div>
                                <div className="text-lg font-bold">{users.length}</div>
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
                                    <span className="text-xs font-bold text-brand-navy">€{t.amount.toString()}</span>
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
