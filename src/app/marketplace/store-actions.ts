
'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-11-27-acacia' as any
})

export async function createCheckoutSession(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to purchase access.' }
    }

    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (!product) {
        return { error: 'Product not found.' }
    }

    const host = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description || undefined,
                        images: product.imageUrl ? [product.imageUrl] : undefined,
                    },
                    unit_amount: Math.round(Number(product.price) * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${host}/dashboard/vault?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${host}/marketplace?canceled=true`,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            productId: product.id
        }
    })

    if (!session.url) {
        return { error: 'Failed to create checkout session.' }
    }

    redirect(session.url)
}
