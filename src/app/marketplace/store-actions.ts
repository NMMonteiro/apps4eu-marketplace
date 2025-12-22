
'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'


export async function createCheckoutSession(productId: string, plan: '1m' | '12m' | '24m' | 'lifetime' = 'lifetime') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to purchase access.' }
    }

    const product = await prisma.product.findUnique({
        where: { id: productId }
    }) as any

    if (!product) {
        return { error: 'Product not found.' }
    }

    const host = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL

    // Determine price based on plan
    let amount = Number(product.price)
    let isRecurring = false
    let interval: 'month' | 'year' = 'month'
    let intervalCount = 1

    if (plan === '1m') {
        amount = Number(product.price1m)
        isRecurring = true
        interval = 'month'
        intervalCount = 1
    } else if (plan === '12m') {
        amount = Number(product.price12m)
        isRecurring = true
        interval = 'year'
        intervalCount = 1
    } else if (plan === '24m') {
        amount = Number(product.price24m)
        isRecurring = true
        interval = 'year'
        intervalCount = 2
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `${product.name} (${plan === 'lifetime' ? 'Lifetime' : plan})`,
                        description: product.description || undefined,
                        images: product.imageUrl ? [product.imageUrl] : undefined,
                    },
                    unit_amount: Math.round(amount * 100),
                    ...(isRecurring && {
                        recurring: {
                            interval: interval,
                            interval_count: intervalCount,
                        }
                    })
                },
                quantity: 1,
            },
        ],
        mode: isRecurring ? 'subscription' : 'payment',
        success_url: `${host}/dashboard/vault?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${host}/marketplace?canceled=true`,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            productId: product.id,
            plan: plan
        }
    })

    if (!session.url) {
        return { error: 'Failed to create checkout session.' }
    }

    redirect(session.url)
}
